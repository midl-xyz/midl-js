// TODO: some unused code here, consider removing it
import type { MidlContextStore } from "@midl-xyz/midl-js-react";
import type { TransactionSerializableBTC } from "viem";
import { serializeTransaction } from "viem";
import { useChainId } from "wagmi";
import { useLastNonce } from "~/hooks/useLastNonce";

type UseSerializeTransactionParams = {
	store?: MidlContextStore;
};

/**
 * Custom hook to serialize a Bitcoin transaction.
 *
 * This hook provides a function to serialize a BTC transaction, incorporating the current nonce and chain ID.
 * Optionally, it can increment the nonce after serialization.
 *
 * @example
 * ```typescript
 * const prepareTx = useSerializeTransaction();
 *
 * const serializedTx = await prepareTx({
 *   to: 'receiverAddress',
 *   value: 1000,
 *   // other transaction fields
 * });
 * ```
 *
 * @returns Function to serialize the given Bitcoin transaction.
 */
export const useSerializeTransaction = ({
	store: customStore,
}: UseSerializeTransactionParams = {}) => {
	const lastNonce = useLastNonce({ store: customStore });
	const globalChainId = useChainId();

	const prepareTx = async ({ chainId, ...tx }: TransactionSerializableBTC) => {
		const serialized = serializeTransaction({
			nonce: lastNonce,
			type: "btc",
			chainId: chainId || globalChainId,
			...tx,
		});

		return serialized;
	};

	return prepareTx;
};
