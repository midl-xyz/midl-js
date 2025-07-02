import { AddressPurpose, type Config } from "@midl-xyz/midl-js-core";
import type { MidlContextState } from "@midl-xyz/midl-js-react";
import {
	type Address,
	type Client,
	encodeFunctionData,
	zeroAddress,
} from "viem";
import type { StoreApi } from "zustand";
import { getPublicKey } from "~/actions";
import { addTxIntention } from "~/actions/addTxIntention";
import { executorAddress } from "~/config";
import { executorAbi } from "~/contracts/abi";
import type { TransactionIntention } from "~/types";

export const addCompleteTxIntention = async (
	config: Config,
	store: StoreApi<MidlContextState>,
	client: Client,
	btcTx: string,
	assetsToWithdraw?: [Address] | [Address, Address],
): Promise<TransactionIntention> => {
	const { network, accounts } = config.getState();
	const { intentions = [] } = store.getState();

	if (!network) {
		throw new Error("No network set");
	}

	const hasWithdraw = true;
	const hasRunesWithdraw =
		intentions.some((it) => it.hasRunesWithdraw) ||
		(assetsToWithdraw?.length ?? 0) > 0;

	const runesReceiver = accounts?.find(
		(it) => it.purpose === AddressPurpose.Ordinals,
	);
	const btcReceiver =
		accounts?.find((it) => it.purpose === AddressPurpose.Payment) ??
		runesReceiver;

	if (!runesReceiver && assetsToWithdraw?.find((it) => it !== zeroAddress)) {
		throw new Error("No ordinals account found to withdraw runes");
	}

	if (!btcReceiver) {
		throw new Error("No account found to withdraw BTC");
	}

	const btcPublicKey = getPublicKey(
		config,
		btcReceiver.publicKey,
	) as `0x${string}`;

	const runesPublicKey = getPublicKey(
		config,
		runesReceiver?.publicKey ?? btcReceiver.publicKey,
	) as `0x${string}`;

	return addTxIntention(config, store, {
		hasWithdraw,
		hasRunesWithdraw,
		evmTransaction: {
			to: executorAddress[network.id] as Address,
			data: encodeFunctionData({
				abi: executorAbi,
				functionName: "completeTx",
				args: [
					`0x${btcTx}`,
					runesPublicKey,
					btcPublicKey,
					assetsToWithdraw ?? [],
					new Array(assetsToWithdraw?.length ?? 0).fill(0n),
				],
			}),
			chainId: client.chain?.id,
		},
	});
};
