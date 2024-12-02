import { useMidlContext } from "@midl-xyz/midl-js-react";

/**
 * Hook to clear the transaction intentions in the store
 */
export const useClearTxIntentions = () => {
	const { store } = useMidlContext();

	return () => {
		store.setState({ intentions: [] });
	};
};
