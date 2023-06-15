import {
  MasaSBT,
  MasaSBT__factory,
} from "@masa-finance/masa-contracts-identity";

import { MasaBase } from "../../../base/masa-base";
import type { ContractFactory } from "../../../contracts";
import { MasaSBTWrapper } from "./sbt-wrapper";

export class MasaSBTBase extends MasaBase {
  /**
   *
   * @param contract
   */
  public attach = <Contract extends MasaSBT>(contract: Contract) => {
    return new MasaSBTWrapper<Contract>(this.masa, contract);
  };

  /**
   *
   * @param address
   * @param factory
   */
  public connect = async <Contract extends MasaSBT>(
    address: string,
    factory: ContractFactory = MasaSBT__factory
  ): Promise<MasaSBTWrapper<Contract>> => {
    const { contract } = await this.masa.contracts.sbt.connect<Contract>(
      address,
      factory
    );

    return this.attach<Contract>(contract);
  };
}
