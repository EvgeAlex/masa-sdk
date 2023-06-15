import type { BigNumber } from "@ethersproject/bignumber";
import { MasaSBT } from "@masa-finance/masa-contracts-identity";

import { MasaModuleBase } from "../../../../base";
import type {
  IIdentityContracts,
  MasaInterface,
  PaymentMethod,
} from "../../../../interface";

export class SBTContractWrapper<
  Contract extends MasaSBT
> extends MasaModuleBase {
  constructor(
    masa: MasaInterface,
    instances: IIdentityContracts,
    public readonly contract: Contract
  ) {
    super(masa, instances);
  }

  /**
   *
   * @param paymentMethod
   * @param slippage
   */
  getPrice = (
    paymentMethod: PaymentMethod,
    slippage: number | undefined = 250
  ): Promise<{
    paymentAddress: string;
    price: BigNumber;
    formattedPrice: string;
    mintFee: BigNumber;
    formattedMintFee: string;
    protocolFee: BigNumber;
    formattedProtocolFee: string;
  }> => this.getMintPrice(paymentMethod, this.contract, slippage);
}
