import { Psbt, initEccLib, networks, payments } from "bitcoinjs-lib";
import coinSelect from "bitcoinselect";
import { broadcastTransaction } from "~/actions/broadcastTransaction";
import { getFeeRate } from "~/actions/getFeeRate";
import { getUTXOs } from "~/actions/getUTXOs";
import { AddressType } from "~/constants";
import type { Config } from "~/createConfig";
import { extractXCoordinate } from "~/utils";
import ky from "ky";

export type TransferBTCParams = {
	transfers: {
		receiver: string;
		amount: number;
	}[];
	feeRate?: number;
	publish?: boolean;
	from?: string;
};

export type TransferBTCResponse = {
	psbt: string;
	txId?: string;
};

export const transferBTC = async (
	config: Config,
	{ transfers, feeRate: customFeeRate, publish, from }: TransferBTCParams,
): Promise<TransferBTCResponse> => {
	if (!config.currentConnection) {
		throw new Error("No connection");
	}

	if (!config.network) {
		throw new Error("No network");
	}

	await import("tiny-secp256k1").then(initEccLib);

	const { accounts } = config.getState();

	const account = from
		? accounts?.find((account) => account.address === from)
		: accounts?.[0];

	if (!account) {
		throw new Error("No account found");
	}

	const network = networks[config.network.network];
	const feeRate = customFeeRate || (await getFeeRate(config)).hourFee;
	const utxos = await getUTXOs(config, account.address);
	const outputs = [];

	for (const transfer of transfers) {
		outputs.push({
			address: transfer.receiver,
			value: transfer.amount,
		});
	}

	const selectedUTXOs = coinSelect(utxos, outputs, feeRate);

	if (!selectedUTXOs.inputs || !selectedUTXOs.outputs) {
		throw new Error("No selected UTXOs");
	}

	const psbt = new Psbt({ network });

	switch (account.addressType) {
		case AddressType.P2SH: {
			const { redeem } = payments.p2sh({
				redeem: payments.p2wpkh({
					pubkey: Buffer.from(account.publicKey, "hex"),
				}),
			});

			for (const input of selectedUTXOs.inputs) {
				const hex = await ky(`${config.network.rpcUrl}/tx/${input.txid}/hex`, {
					retry: {
						limit: 5,
					},
				}).text();

				psbt.addInput({
					hash: input.txid as string,
					index: input.vout,
					nonWitnessUtxo: Buffer.from(hex, "hex"),
					redeemScript: redeem?.output,
				});
			}

			break;
		}

		case AddressType.P2WPKH: {
			const p2wpkh = payments.p2wpkh({
				pubkey: Buffer.from(account.publicKey, "hex"),
				network,
			});

			for (const input of selectedUTXOs.inputs) {
				psbt.addInput({
					hash: input.txid as string,
					index: input.vout,
					witnessUtxo: {
						// biome-ignore lint/style/noNonNullAssertion: we know it's there
						script: p2wpkh.output!,
						value: input.value,
					},
				});
			}

			break;
		}

		case AddressType.P2TR: {
			const xOnly = Buffer.from(extractXCoordinate(account.publicKey), "hex");

			const p2tr = payments.p2tr({
				internalPubkey: xOnly,
				network,
			});

			for (const input of selectedUTXOs.inputs) {
				psbt.addInput({
					hash: input.txid as string,
					index: input.vout,
					witnessUtxo: {
						value: input.value,
						// biome-ignore lint/style/noNonNullAssertion: <explanation>
						script: p2tr!.output!,
					},
					tapInternalKey: xOnly,
				});
			}
		}
	}

	for (const output of selectedUTXOs.outputs) {
		if (!output.address) {
			output.address = account.address;
		}

		psbt.addOutput(output as Parameters<typeof psbt.addOutput>[0]);
	}

	const psbtData = psbt.toBase64();

	const data = await config.currentConnection.signPSBT({
		psbt: psbtData,
		signInputs: {
			[account.address]: selectedUTXOs.inputs.map((_input, index) => index),
		},
	});

	const signedPSBT = Psbt.fromBase64(data.psbt);

	signedPSBT.finalizeAllInputs();

	const psbtBase64 = signedPSBT.toBase64();

	if (publish) {
		const hex = signedPSBT.extractTransaction().toHex();

		const txId = await broadcastTransaction(config, hex);

		return {
			psbt: psbtBase64,
			txId,
		};
	}

	return { psbt: psbtBase64 };
};
