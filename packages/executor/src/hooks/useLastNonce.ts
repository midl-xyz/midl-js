import { useMidlContext } from "@midl-xyz/midl-js-react";
import { useAccount, useTransactionCount } from "wagmi";
import { useStore } from "zustand";

export const useLastNonce = () => {
	const { store } = useMidlContext();
	const { wallet } = useStore(store);
	const { address } = useAccount();
	const { data } = useTransactionCount({ address });

	if (!address) {
		return data ?? 0;
	}

	return data ?? 0 + (wallet?.[address]?.nonce ?? 0);
};
