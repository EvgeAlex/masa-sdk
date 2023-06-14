import type { LogDescription } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";
import type { ReferenceSBTAuthority } from "@masa-finance/masa-contracts-identity";
import type { PayableOverrides } from "ethers";

import { Messages } from "../../../../collections";
import type {
  IIdentityContracts,
  MasaInterface,
  PaymentMethod,
} from "../../../../interface";
import { isNativeCurrency } from "../../../../utils";
import { SBTContract } from "../SBT";
import { ASBTContractWrapper } from "./asbt-contract-wrapper";

export class ASBTContract<
  Contract extends ReferenceSBTAuthority
> extends SBTContract<Contract> {
  /**
   *
   * @param masa
   * @param instances
   */
  constructor(masa: MasaInterface, instances: IIdentityContracts) {
    super(masa, instances);

    this.attach.bind(this);
  }

  /**
   *
   * @param sbtContract
   */
  public attach(sbtContract: Contract): ASBTContractWrapper<Contract> {
    return {
      ...super.attach(sbtContract),

      /**
       *
       * @param paymentMethod
       * @param receiver
       */
      mint: async (paymentMethod: PaymentMethod, receiver: string) => {
        const { getPrice } = await this.masa.contracts.asbt.attach(sbtContract);

        // current limit for ASBT is 1 on the default installation
        let limit: number = 1;

        try {
          limit = (await sbtContract.maxSBTToMint()).toNumber();
        } catch {
          if (this.masa.config.verbose) {
            console.info("Loading limit failed, falling back to 1!");
          }
        }

        const balance: BigNumber = await sbtContract.balanceOf(receiver);

        if (limit > 0 && balance.gte(limit)) {
          console.error(
            `Minting of ASBT failed: '${receiver}' exceeded the limit of '${limit}'!`
          );
          return false;
        }

        const { price, paymentAddress } = await getPrice(paymentMethod);

        const mintASBTArguments: [
          string, // paymentAddress string
          string // receiver string
        ] = [paymentAddress, receiver];

        const feeData = await this.getNetworkFeeInformation();

        const mintASBTOverrides: PayableOverrides = {
          value: isNativeCurrency(paymentMethod) ? price : undefined,
          ...(feeData && feeData.maxPriorityFeePerGas
            ? {
                maxPriorityFeePerGas: BigNumber.from(
                  feeData.maxPriorityFeePerGas
                ),
              }
            : undefined),
          ...(feeData && feeData.maxFeePerGas
            ? {
                maxFeePerGas: BigNumber.from(feeData.maxFeePerGas),
              }
            : undefined),
        };

        if (this.masa.config.verbose) {
          console.info(mintASBTArguments, mintASBTOverrides);
        }

        const {
          "mint(address,address)": mint,
          estimateGas: { "mint(address,address)": estimateGas },
        } = sbtContract;

        let gasLimit: BigNumber = await estimateGas(
          ...mintASBTArguments,
          mintASBTOverrides
        );

        if (this.masa.config.network?.gasSlippagePercentage) {
          gasLimit = ASBTContract.addSlippage(
            gasLimit,
            this.masa.config.network.gasSlippagePercentage
          );
        }

        const { wait, hash } = await mint(...mintASBTArguments, {
          ...mintASBTOverrides,
          gasLimit,
        });

        console.log(
          Messages.WaitingToFinalize(
            hash,
            this.masa.config.network?.blockExplorerUrls?.[0]
          )
        );

        const { logs } = await wait();

        const parsedLogs = this.masa.contracts.parseLogs(logs, [sbtContract]);

        const mintEvent = parsedLogs.find(
          (log: LogDescription) => log.name === "Mint"
        );

        if (mintEvent) {
          const { args } = mintEvent;
          console.log(
            `Minted to token with ID: ${args._tokenId} receiver '${args._owner}'`
          );

          return true;
        }

        return false;
      },
    };
  }
}
