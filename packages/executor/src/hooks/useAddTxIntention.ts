import { useMidlContext, useStore } from "@midl-xyz/midl-js-react";
import type { TransactionIntention } from "~/types/intention";

type AddTxIntentionVariables = TransactionIntention & {
	reset?: boolean;
};

/**
 * Custom hook to add a transaction intention.
 *
 * This hook provides a function to add a new transaction intention to the store,
 * enforcing constraints such as the maximum number of intentions and limiting runes deposits.
 *
 * @example
 * ```typescript
 * const { addTxIntention, txIntentions } = useAddTxIntention();
 *
 * addTxIntention({
 *   from: 'senderAddress',
 *   to: 'receiverAddress',
 *   amount: 1000,
 *   hasRunesDeposit: true,
 *   // other intention fields
 * });
 * ```
 *
 * @returns
 * - **addTxIntention**: `(variables: AddTxIntentionVariables) => void` – Function to add a new transaction intention.
 * - **txIntentions**: `TransactionIntention[]` – The current list of transaction intentions.
 */
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
