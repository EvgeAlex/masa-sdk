import { MasaSBTSelfSovereign } from "@masa-finance/masa-contracts-identity";
import { BigNumber } from "ethers";
import Masa from "../masa";
import { Messages } from "../utils";

export const burnSBT = async (
  masa: Masa,
  contract: MasaSBTSelfSovereign,
  SBTId: BigNumber
): Promise<boolean> => {
  try {
    console.log(`Burning SBT with ID '${SBTId}'!`);

    const {
      estimateGas: { burn: estimateGas },
      burn,
    } = contract.connect(masa.config.wallet);

    const gasLimit: BigNumber = await estimateGas(SBTId);

    const { wait, hash } = await burn(SBTId, { gasLimit });

    console.log(Messages.WaitingToFinalize(hash));
    await wait();

    console.log(`Burned SBT with ID '${SBTId}'!`);
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Burning SBT Failed! '${error.message}'`);
    }
  }

  return false;
};
