import { useMidlContext, useStore } from "@midl-xyz/midl-js-react";
import type { TransactionSerializableBTC } from "viem";
import { useChainId } from "wagmi";
import { useEVMAddress } from "~/hooks/useEVMAddress";
import type { TransactionIntention } from "~/types/intention";

type AddTxIntentionVariables = Omit<TransactionIntention, "evmTransaction"> & {
	evmTransaction?: Omit<TransactionIntention["evmTransaction"], "chainId"> & {
		chainId?: TransactionSerializableBTC["chainId"];
	};
} & {
	/**
	 * If true, the array of intentions will be cleared before adding the new one
	 */
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
	const chainId = useChainId();
	const evmAddress = useEVMAddress();

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

		if (intention.evmTransaction) {
			intention.evmTransaction.chainId =
				intention.evmTransaction.chainId ?? chainId;

			intention.evmTransaction.from =
				intention.evmTransaction.from ?? evmAddress;
		}

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
