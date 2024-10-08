import { serializeTransaction } from "viem";
import type { FeeValuesLegacy, TransactionSerializableBase } from "viem";
import { useChainId } from "wagmi";
import { useIncrementNonce } from "~/hooks/useIncrementNonce";
import { useLastNonce } from "~/hooks/useLastNonce";

export const useSerializeTransaction = ({
  shouldIncrementNonce = false,
}: { shouldIncrementNonce?: boolean } = {}) => {
  const lastNonce = useLastNonce();
  const chainId = useChainId();
  const incrementNonce = useIncrementNonce();

  const prepareTx = async ({
    ...tx
  }: Omit<TransactionSerializableBase, "type"> &
    Pick<FeeValuesLegacy, "gasPrice">) => {
    const serialized = serializeTransaction({
      nonce: lastNonce,
      type: "btc",
      chainId: chainId,
      ...tx,
    });

    if (shouldIncrementNonce) {
      incrementNonce();
    }

    return serialized;
  };

  return prepareTx;
};
