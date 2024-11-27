import { useMidlContext } from "@midl-xyz/midl-js-react";

export const useClearTxIntentions = () => {
	const { store } = useMidlContext();

	return () => {
		store.setState({ intentions: [] });
	};
};
