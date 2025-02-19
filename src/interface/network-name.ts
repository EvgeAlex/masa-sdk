export type NetworkName =
  // eth
  | "goerli" // testnet
  | "sepolia" // testnet
  | "ethereum" // mainnet
  // celo
  | "alfajores" // testnet
  | "celo" // mainnet
  // polygon
  | "mumbai" // testnet
  | "polygon" // mainnet
  // BSC
  | "bsctest" // testnet
  | "bsc" // mainnet
  // OP BNB
  | "opbnbtest" // testnet
  | "opbnb" // mainnet
  // base
  | "basegoerli" // testnet
  | "basesepolia" // testnet
  | "base" // mainnet
  // scroll
  | "scrollsepolia" // testnet
  | "scroll" // mainnet
  // fallback for unknown networks
  | "unknown";
