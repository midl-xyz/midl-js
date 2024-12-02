import { useStore } from "@midl-xyz/midl-js-react";
import { useAccount, useTransactionCount } from "wagmi";

/**
 * Custom hook to retrieve the last nonce for the current account.
 *
 * This hook combines the on-chain transaction count with the local store's nonce to determine the current nonce used for signing transactions.
 *
 * @example
 * ```typescript
 * const lastNonce = useLastNonce();
 * console.log(`Last nonce: ${lastNonce}`);
 * ```
 *
 * @returns {number} – The last nonce value for the current account, or 0 if not available.
 */
export const useLastNonce = () => {
	const { wallet } = useStore();
	const { address } = useAccount();
	const { data } = useTransactionCount({ address });

	if (!address) {
		return data ?? 0;
	}

	return data ?? 0 + (wallet?.[address]?.nonce ?? 0);
};
