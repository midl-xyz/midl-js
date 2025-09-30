import { type MidlContextStore, useStoreInternal } from "@midl/react";

type UseClearTxIntentionsParams = {
	/**
	 * Custom store to override the default.
	 */
	store?: MidlContextStore;
};

/**
 * Clears all transaction intentions from the store.
 *
 * @param params - Optional parameters
 * @returns A function to clear all transaction intentions.
 *
 * @example
 * const clearIntentions = useClearTxIntentions();
 * clearIntentions();
 */
export const useClearTxIntentions = ({
	store: customStore,
}: UseClearTxIntentionsParams = {}) => {
	const store = useStoreInternal(customStore);

	return () => {
		store.setState({ intentions: [] });
	};
};
