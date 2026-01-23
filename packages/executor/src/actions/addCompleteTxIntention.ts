import { AddressPurpose, AddressType, type Config } from "@midl/core";
import * as bitcoin from "bitcoinjs-lib";
import { encodeFunctionData, maxUint256, padBytes, padHex, toHex } from "viem";
import { getPublicKey } from "~/actions";
import { addTxIntention } from "~/actions/addTxIntention";
import { SystemContracts } from "~/config";
import { executorAbi } from "~/contracts/abi";
import type { TransactionIntention, Withdrawal } from "~/types";
import {
	getCreate2RuneAddress,
	getReceiverBytesHex,
	satoshisToWei,
} from "~/utils";

export const COMPLETE_TX_GAS = 200_000n;

/**
 * Creates a CompleteTx Intention. This prepares an EVM transaction that calls the `completeTx` function on the Executor contract. The `completeTx` is used to create a transaction to withdraw assets from the MIDL Layer and reflect the execution result to the Bitcoin network.
 *
 * @param config - The configuration object.
 * @param withdraw - Withdrawal details for BTC and/or runes. If omitted, no assets will be withdrawn.
 * @returns {TransactionIntention}
 *
 * @example
 * const intention = await addCompleteTxIntention(config, {
 *   satoshis: 5000,
 *   runes: [{ id: "840000:1", amount: 1n }],
 * });
 */
export const addCompleteTxIntention = async (
	config: Config,
	withdraw?: Withdrawal,
): Promise<TransactionIntention> => {
	const { network, accounts } = config.getState();

	if (!network) {
		throw new Error("No network set");
	}

	const assetsToWithdraw = typeof withdraw === "object" ? withdraw?.runes : [];
	const satoshisToWithdraw =
		typeof withdraw === "object"
			? (withdraw?.satoshis ?? Number.MAX_SAFE_INTEGER)
			: Number.MAX_SAFE_INTEGER;

	const runesReceiver =
		accounts?.find((it) => it.purpose === AddressPurpose.Ordinals) ||
		accounts?.find((it) => it.purpose === AddressPurpose.Payment);

	const btcReceiver =
		accounts?.find((it) => it.purpose === AddressPurpose.Payment) ??
		runesReceiver;

	if (!runesReceiver) {
		throw new Error("No ordinals account found to withdraw runes");
	}

	if (!btcReceiver) {
		throw new Error("No account found to withdraw BTC");
	}

	const receiver = getReceiverBytesHex(runesReceiver, network);
	const receiverBTC = getReceiverBytesHex(btcReceiver, network);

	return addTxIntention(config, {
		withdraw,
		evmTransaction: {
			to: SystemContracts.Executor,
			// We set the gas limit to a high value to ensure the transaction goes through
			gas: COMPLETE_TX_GAS,

			data: encodeFunctionData({
				abi: executorAbi,
				functionName: "completeTx",

				args: [
					receiver,
					receiverBTC,
					assetsToWithdraw?.map(
						(rune) => rune.address ?? getCreate2RuneAddress(rune.id),
					) ?? [],
					assetsToWithdraw?.map((rune) => rune.amount) ?? [],
					satoshisToWithdraw === Number.MAX_SAFE_INTEGER
						? maxUint256
						: satoshisToWei(satoshisToWithdraw),
				],
			}),
		},
	});
};
