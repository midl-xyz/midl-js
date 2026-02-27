import { type Config, getDefaultAccount } from "@midl/core";
import {
	addTxIntention,
	getEVMAddress,
	type PartialIntention,
} from "@midl/executor";
import type { PublicClient } from "viem";
import type { StoreApi } from "zustand/vanilla";
import type { MidlHardhatStore } from "~/actions/createStore";

export const addTxIntentionToStore = async (
	config: Config,
	store: StoreApi<MidlHardhatStore>,
	publicClient: PublicClient,
	data: PartialIntention,
) => {
	const evmAddress =
		data.evmTransaction?.from ??
		getEVMAddress(getDefaultAccount(config), config.getState().network);

	const currentNonce = await publicClient.getTransactionCount({
		address: evmAddress,
	});

	const totalIntentions = store.getState().intentions.length;
	const nonce = data?.evmTransaction?.nonce ?? currentNonce + totalIntentions;

	const intention = await addTxIntention(config, {
		...data,
		evmTransaction: {
			...data.evmTransaction,
			nonce,
		},
	});

	store.setState((state) => ({
		intentions: [...state.intentions, intention],
	}));

	return intention;
};
