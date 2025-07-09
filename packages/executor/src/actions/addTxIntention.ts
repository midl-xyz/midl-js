import { type Config, getDefaultAccount } from "@midl-xyz/midl-js-core";
import type { MidlContextState } from "@midl-xyz/midl-js-react";
import type { TransactionSerializableBTC } from "viem";
import type { StoreApi } from "zustand";
import type { TransactionIntention } from "~/types/intention";
import { getEVMAddress } from "~/utils";

export type PartialIntention = Omit<
	TransactionIntention,
	"evmTransaction" | "signedEvmTransaction"
> & {
	evmTransaction?: Omit<TransactionIntention["evmTransaction"], "chainId"> & {
		chainId?: TransactionSerializableBTC["chainId"];
	};
};

/**
 * Add a transaction intention to the store
 *
 * @param config The configuration object
 * @param store The store object
 * @param intention The intention to add
 * @param reset If true, the intentions array will be reset
 * @param publicKey Public key to use to sign the transaction
 * @returns The added intention
 */
export const addTxIntention = async (
	config: Config,
	store: StoreApi<MidlContextState>,
	intention: PartialIntention,
	reset = false,
	publicKey?: string,
): Promise<TransactionIntention> => {
	const account = getDefaultAccount(
		config,
		publicKey ? (it) => it.publicKey === publicKey : undefined,
	);

	if (!account) {
		throw new Error("No account found for public key");
	}

	const evmAddress = getEVMAddress(config, account);
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
		intention.evmTransaction.from = intention.evmTransaction.from ?? evmAddress;
	}

	store.setState({
		intentions: reset
			? [intention as TransactionIntention]
			: [...intentions, intention as TransactionIntention],
	});

	return intention as TransactionIntention;
};
