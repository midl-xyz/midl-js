import { serializeTransaction } from "viem";
import type { TransactionSerializableBTC } from "viem/_types/types/transaction";
import { useChainId } from "wagmi";
import { useIncrementNonce } from "~/hooks/useIncrementNonce";
import { useLastNonce } from "~/hooks/useLastNonce";

export const useSerializeTransaction = ({
  shouldIncrementNonce = false,
}: { shouldIncrementNonce?: boolean } = {}) => {
  const lastNonce = useLastNonce();
  const globalChainId = useChainId();
  const incrementNonce = useIncrementNonce();

  const prepareTx = async ({ chainId, ...tx }: TransactionSerializableBTC) => {
    const serialized = serializeTransaction({
      nonce: lastNonce,
      type: "btc",
      chainId: chainId ?? globalChainId,
      ...tx,
    });

    if (shouldIncrementNonce) {
      incrementNonce();
    }

    return serialized;
  };

  return prepareTx;
};
