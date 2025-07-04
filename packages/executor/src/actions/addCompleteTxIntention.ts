import {
	AddressPurpose,
	AddressType,
	type Config,
} from "@midl-xyz/midl-js-core";
import type { MidlContextState } from "@midl-xyz/midl-js-react";
import * as bitcoin from "bitcoinjs-lib";
import {
	type Address,
	encodeFunctionData,
	padBytes,
	padHex,
	toHex,
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

	const receiver = getPublicKey(
		config,
		runesReceiver?.publicKey ?? btcReceiver.publicKey,
	) as `0x${string}`;

	let receiverBTC = padHex("0x0", { size: 32 });

	if (btcReceiver.address !== runesReceiver?.address) {
		if (btcReceiver.addressType !== AddressType.P2WPKH) {
			throw new Error(
				`Unsupported address type for BTC receiver: ${btcReceiver.addressType}`,
			);
		}

		const p2wpkh = bitcoin.payments.p2wpkh({
			address: btcReceiver.address,
			network: bitcoin.networks[network.network],
		});

		receiverBTC = toHex(
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			padBytes(p2wpkh.output!, {
				size: 32,
			}),
		);
	}

	return addTxIntention(config, store, {
		hasWithdraw,
		hasRunesWithdraw,
		evmTransaction: {
			to: executorAddress[network.id] as Address,
			data: encodeFunctionData({
				abi: executorAbi,
				functionName: "completeTx",
				args: [
					receiver,
					receiverBTC,
					assetsToWithdraw ?? [],
					new Array(assetsToWithdraw?.length ?? 0).fill(0n),
				],
			}),
		},
	});
};
