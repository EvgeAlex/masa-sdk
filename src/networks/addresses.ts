import type { Addresses, NetworkName } from "../interface";
import { base, basegoerli } from "./base";
import { bsc, bsctest } from "./bsc";
import { alfajores, celo } from "./celo";
import { ethereum, goerli } from "./eth";
import { opbnb, opbnbtest } from "./opbnb";
import { mumbai, polygon } from "./polygon";

export const addresses: Partial<{ [key in NetworkName]: Addresses }> = {
  // eth
  ethereum,
  goerli,
  // bsc
  bsc,
  bsctest,
  // opbnb
  opbnb,
  opbnbtest,
  // celo
  celo,
  alfajores,
  // polygon
  mumbai,
  polygon,
  // base
  base,
  basegoerli,
};
