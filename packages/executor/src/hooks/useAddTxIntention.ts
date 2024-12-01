import { useMidlContext, useStore } from "@midl-xyz/midl-js-react";
import type { TransactionSerializableBTC } from "viem";
import { useChainId } from "wagmi";
import type { TransactionIntention } from "~/types/intention";

type AddTxIntentionVariables = Omit<TransactionIntention, "evmTransaction"> & {
	evmTransaction: Omit<TransactionIntention["evmTransaction"], "chainId"> & {
		chainId?: TransactionSerializableBTC["chainId"];
	};
} & {
	reset?: boolean;
};

export const useAddTxIntention = () => {
	const { store } = useMidlContext();
	const { intentions = [] } = useStore();
	const chainId = useChainId();

	const addTxIntention = ({ reset, ...intention }: AddTxIntentionVariables) => {
		const { intentions = [] } = store.getState();
		if (intentions?.length === 10) {
			throw new Error("Maximum number of intentions reached");
		}

		if (
			intentions.filter((it) => it.hasRunesDeposit).length >= 2 &&
			intention.hasRunesDeposit
		) {
			throw new Error(
				"Transferring more than 2 rune deposits at once is not allowed",
			);
		}

		intention.evmTransaction.chainId = chainId;

		store.setState({
			intentions: reset
				? [intention as TransactionIntention]
				: [...intentions, intention as TransactionIntention],
		});
	};

	return {
		addTxIntention,
		txIntentions: intentions,
	};
};
