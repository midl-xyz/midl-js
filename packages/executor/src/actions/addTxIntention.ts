import type { Config } from "@midl-xyz/midl-js-core";
import type { MidlContextState } from "@midl-xyz/midl-js-react";
import type { TransactionSerializableBTC } from "viem";
import type { StoreApi } from "zustand";
import { getPublicKeyForAccount } from "~/actions/getPublicKeyForAccount";
import type { TransactionIntention } from "~/types/intention";
import { getEVMAddress, getEVMFromBitcoinNetwork } from "~/utils";

export type PartialIntention = Omit<TransactionIntention, "evmTransaction"> & {
	evmTransaction?: Omit<TransactionIntention["evmTransaction"], "chainId"> & {
		chainId?: TransactionSerializableBTC["chainId"];
	};
};

export const addTxIntention = async (
	config: Config,
	store: StoreApi<MidlContextState>,
	intention: PartialIntention,
	reset = false,
	publicKey?: string,
): Promise<TransactionIntention> => {
	if (!config.network) {
		throw new Error("No network found");
	}

	const pk = await getPublicKeyForAccount(config, publicKey);
	const chain = getEVMFromBitcoinNetwork(config.network);
	const evmAddress = getEVMAddress(pk);
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
			intention.evmTransaction.chainId ?? chain.id;

		intention.evmTransaction.from = intention.evmTransaction.from ?? evmAddress;
	}

	store.setState({
		intentions: reset
			? [intention as TransactionIntention]
			: [...intentions, intention as TransactionIntention],
	});

	return intention as TransactionIntention;
};
