import { useMidlContext } from "@midl-xyz/midl-js-react";
import { useAccount } from "wagmi";

export const useIncrementNonce = () => {
	const { store } = useMidlContext();
	const { address } = useAccount();

	return () => {
		if (!address) {
			return;
		}

		const { wallet } = store.getState();

		const nonce = wallet?.[address]?.nonce ?? 0;

		store.setState({
			wallet: {
				...wallet,
				[address]: {
					nonce: nonce + 1,
					transactions: wallet?.[address]?.transactions ?? [],
				},
			},
		});
	};
};
