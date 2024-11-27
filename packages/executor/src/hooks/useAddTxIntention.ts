import { useMidlContext, useStore } from "@midl-xyz/midl-js-react";
import type { TransactionIntention } from "~/types/intention";

type AddTxIntentionVariables = TransactionIntention & {
	reset?: boolean;
};

export const useAddTxIntention = () => {
	const { store } = useMidlContext();
	const { intentions = [] } = useStore();

	const addTxIntention = ({ reset, ...intention }: AddTxIntentionVariables) => {
		const { intentions = [] } = store.getState();
		if (intentions?.length === 10) {
			throw new Error("Maximum number of intentions reached");
		}

		if (
			intentions.some((it) => it.hasRunesDeposit) &&
			intention.hasRunesDeposit
		) {
			throw new Error(
				"Transferring more than one runes deposit is not allowed",
			);
		}

		store.setState({
			intentions: reset ? [intention] : [...intentions, intention],
		});
	};

	return {
		addTxIntention,
		txIntentions: intentions,
	};
};
