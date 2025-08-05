import { type MidlContextStore, useStore } from "@midl-xyz/midl-js-react";
import { useAccount, useTransactionCount } from "wagmi";

type UseLastNonceParams = {
	/**
	 * Custom store to override the default.
	 */
	store?: MidlContextStore;
};

/**
 * Retrieves the last nonce for the current account.
 *
 * This hook combines the on-chain transaction count with the local store's nonce to determine the current nonce used for signing transactions.
 *
 * @example
 * ```typescript
 * const lastNonce = useLastNonce();
 * console.log(`Last nonce: ${lastNonce}`);
 * ```
 *
 * @returns The last nonce value for the current account, or 0 if not available.
 */
export const useLastNonce = ({
	store: customStore,
}: UseLastNonceParams = {}) => {
	const { wallet } = useStore(customStore);
	const { address } = useAccount();
	const { data } = useTransactionCount({ address });

	if (!address) {
		return data ?? 0;
	}

	return data ?? 0 + (wallet?.[address]?.nonce ?? 0);
};
