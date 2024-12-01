import { useMidlContext } from "@midl-xyz/midl-js-react";

/**
 * Custom hook to clear all transaction intentions.
 *
 * This hook provides a function to reset the transaction intentions in the store.
 *
 * @example
 * ```typescript
 * const clearIntentions = useClearTxIntentions();
 *
 * clearIntentions();
 * ```
 *
 * @returns
 * - **clearIntentions**: `() => void` – Function to clear all transaction intentions.
 */
export const useClearTxIntentions = () => {
	const { store } = useMidlContext();

	return () => {
		store.setState({ intentions: [] });
	};
};
