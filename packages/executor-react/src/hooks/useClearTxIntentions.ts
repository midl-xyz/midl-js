import { clearTxIntentions } from "@midl-xyz/midl-js-executor";
import {
	type MidlContextStore,
	useStoreInternal,
} from "@midl-xyz/midl-js-react";

type UseClearTxIntentionsParams = {
	store?: MidlContextStore;
};

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
export const useClearTxIntentions = ({
	store: customStore,
}: UseClearTxIntentionsParams = {}) => {
	const store = useStoreInternal(customStore);

	return () => {
		clearTxIntentions(store);
	};
};
