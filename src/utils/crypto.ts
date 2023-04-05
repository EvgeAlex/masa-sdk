import {
  BaseContract,
  BigNumber,
  BytesLike,
  Signer,
  TypedDataDomain,
  TypedDataField,
  utils,
  Wallet,
} from "ethers";

export const isBigNumber = (item: BigNumber | string): item is BigNumber => {
  return (item as BigNumber)._isBigNumber;
};

/**
 *
 * @param data
 */
const hashData = (data: BytesLike) => utils.keccak256(data);

/**
 *
 * @param msg
 * @param wallet
 * @param doHash
 */
export const signMessage = async (
  msg: string,
  wallet: Signer | Wallet,
  doHash: boolean = false
): Promise<string | undefined> => {
  let signature;

  try {
    const data = utils.toUtf8Bytes(msg);
    const hash = doHash ? hashData(data) : data;
    signature = await wallet.signMessage(utils.arrayify(hash));
  } catch (error) {
    console.error("Sign message failed!", error);
  }

  return signature;
};

/**
 *
 * @param contract
 * @param wallet
 * @param name
 * @param types
 * @param value
 */
export const signTypedData = async (
  contract: BaseContract,
  wallet: Wallet,
  name: string,
  types: Record<string, Array<TypedDataField>>,
  value: Record<string, string | BigNumber | number>
): Promise<{ signature: string; domain: TypedDataDomain }> => {
  const domain = await generateSignatureDomain(wallet, name, contract.address);
  const signature = await wallet._signTypedData(domain, types, value);

  return { signature, domain };
};

export const generateSignatureDomain = async (
  wallet: Wallet,
  name: string,
  verifyingContract: string
): Promise<TypedDataDomain> => {
  const chainId = (await wallet.provider.getNetwork()).chainId;

  const domain: TypedDataDomain = {
    name,
    version: "1.0.0",
    chainId,
    verifyingContract,
  };

  return domain;
};

/**
 *
 * @param msg
 * @param signature
 * @param doHash
 */
export const recoverAddress = (
  msg: string,
  signature: string,
  doHash: boolean = false
): string | undefined => {
  let recovered;

  try {
    const data = utils.toUtf8Bytes(msg);
    const hash = doHash ? hashData(data) : data;
    recovered = utils.recoverAddress(
      utils.arrayify(utils.hashMessage(utils.arrayify(hash))),
      signature
    );
  } catch (err) {
    console.error(`Address recovery failed!`, err);
  }

  return recovered;
};
