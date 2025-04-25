import { useMidlContext } from "@midl-xyz/midl-js-react";
import { clearTxIntentions } from "@midl-xyz/midl-js-executor";

/**
 * Clear all transaction intentions from the store
 *
 * @example
 * ```typescript
 * const clearIntentions = useClearTxIntentions();
 *
 * clearIntentions();
 * ```
 *
 * @returns Function to clear all transaction intentions.
 */
export const useClearTxIntentions = () => {
	const { store } = useMidlContext();

	return () => {
		clearTxIntentions(store);
	};
};
