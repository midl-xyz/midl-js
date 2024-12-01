import { serializeTransaction } from "viem";
import type { FeeValuesLegacy, TransactionSerializableBTC } from "viem";
import { useChainId } from "wagmi";
import { useIncrementNonce } from "~/hooks/useIncrementNonce";
import { useLastNonce } from "~/hooks/useLastNonce";

/**
 * Custom hook to serialize a Bitcoin transaction.
 *
 * This hook provides a function to serialize a BTC transaction, incorporating the current nonce and chain ID.
 * Optionally, it can increment the nonce after serialization.
 *
 * @example
 * ```typescript
 * const prepareTx = useSerializeTransaction({ shouldIncrementNonce: true });
 *
 * const serializedTx = await prepareTx({
 *   to: 'receiverAddress',
 *   value: 1000,
 *   // other transaction fields
 * });
 * ```
 *
 * @param {Object} [params] - Configuration options for serializing the transaction.
 * @param {boolean} [params.shouldIncrementNonce=false] - Whether to increment the nonce after serialization.
 *
 * @returns {(tx: TransactionSerializableBTC) => Promise<string>} – Function to serialize the given Bitcoin transaction.
 */
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
      chainId: chainId || globalChainId,
      ...tx,
    });

    if (shouldIncrementNonce) {
      incrementNonce();
    }

    return serialized;
  };

  return prepareTx;
};
