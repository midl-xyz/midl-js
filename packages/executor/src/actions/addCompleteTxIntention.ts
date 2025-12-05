import { AddressPurpose, AddressType, type Config } from "@midl/core";
import * as bitcoin from "bitcoinjs-lib";
import { encodeFunctionData, maxUint256, padBytes, padHex, toHex } from "viem";
import { getPublicKey } from "~/actions";
import { addTxIntention } from "~/actions/addTxIntention";
import { SystemContracts } from "~/config";
import { executorAbi } from "~/contracts/abi";
import type { TransactionIntention, Withdrawal } from "~/types";
import { getCreate2RuneAddress, satoshisToWei } from "~/utils";

export const COMPLETE_TX_GAS = 200_000n;

/**
 * Creates a CompleteTx Intention. This prepares an EVM transaction that calls the `completeTx` function on the Executor contract. The `completeTx` is used to create a transaction to withdraw assets from the MIDL Layer and reflect the execution result to the Bitcoin network.
 *
 * @param config - The configuration object.
 * @param assetsToWithdraw - ERC20 addresses corresponding to Runes to withdraw. If omitted, no assets will be withdrawn.
 * @returns {TransactionIntention}
 *
 * @example
 * const intention = await addCompleteTxIntention(config, [btcAddress, runeAddress]);
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
		typeof withdraw === "object" ? (withdraw?.satoshis ?? 0) : 0;

	const runesReceiver = accounts?.find(
		(it) => it.purpose === AddressPurpose.Ordinals,
	);
	const btcReceiver =
		accounts?.find((it) => it.purpose === AddressPurpose.Payment) ??
		runesReceiver;

	if (!runesReceiver) {
		throw new Error("No ordinals account found to withdraw runes");
	}

	if (!btcReceiver) {
		throw new Error("No account found to withdraw BTC");
	}

	const receiver = getPublicKey(
		runesReceiver ?? btcReceiver,
		network,
	) as `0x${string}`;

	let receiverBTC = padHex("0x0", { size: 32 });

	if (btcReceiver.address !== runesReceiver?.address) {
		switch (btcReceiver.addressType) {
			case AddressType.P2SH_P2WPKH: {
				const p2wpkh = bitcoin.payments.p2wpkh({
					pubkey: Buffer.from(btcReceiver.publicKey, "hex"),
					network: bitcoin.networks[network.network],
				});
				const p2sh = bitcoin.payments.p2sh({
					redeem: p2wpkh,
					network: bitcoin.networks[network.network],
				});

				receiverBTC = toHex(
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					padBytes(p2sh.output!, {
						size: 32,
					}),
				);

				break;
			}
			case AddressType.P2WPKH: {
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

				break;
			}
		}
	}

	return addTxIntention(config, {
		withdraw,
		evmTransaction: {
			to: SystemContracts.Executor,
			// We set the gas limit to a high value to ensure the transaction goes through
			gas: COMPLETE_TX_GAS,
			value: satoshisToWei(satoshisToWithdraw),
			data: encodeFunctionData({
				abi: executorAbi,
				functionName: "completeTx",
				args: [
					receiver,
					receiverBTC,
					assetsToWithdraw?.map(
						(rune) => rune.address ?? getCreate2RuneAddress(rune.id),
					) ?? [],
					assetsToWithdraw?.map((rune) =>
						// TODO: When new contracts are deployed, we should use the actual rune amount. For we indicate 0n as maxUint256 to withdraw all available runes.
						rune.amount === maxUint256 ? 0n : rune.amount,
					) ?? [],
				],
			}),
		},
	});
};
