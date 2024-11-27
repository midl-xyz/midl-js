import { useStore } from "@midl-xyz/midl-js-react";
import { useAccount, useTransactionCount } from "wagmi";

export const useLastNonce = () => {
	const { wallet } = useStore();
	const { address } = useAccount();
	const { data } = useTransactionCount({ address });

	if (!address) {
		return data ?? 0;
	}

	return data ?? 0 + (wallet?.[address]?.nonce ?? 0);
};
