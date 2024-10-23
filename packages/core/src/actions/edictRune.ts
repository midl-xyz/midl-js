import { Psbt, initEccLib, networks, payments } from "bitcoinjs-lib";
import coinSelect from "bitcoinselect";
import { Edict, RuneId, Runestone, none, some } from "runelib";
import { AddressPurpose } from "sats-connect";
import { broadcastTransaction } from "~/actions/broadcastTransaction";
import { getFeeRate } from "~/actions/getFeeRate";
import { type RuneUTXO, getRuneUTXO } from "~/actions/getRuneUTXO";
import { getUTXOs } from "~/actions/getUTXOs";
import { AddressType } from "~/constants";
import type { Config } from "~/createConfig";
import { extractXCoordinate, runeUTXOSelect } from "~/utils";
import ky from "ky";

type TransferOutput = {
	address: string;
	value: number;
};

export type EdictRuneParams = {
	from?: string;
	transfers: (
		| {
				runeId: string;
				amount: bigint;
				receiver: string;
		  }
		| {
				receiver: string;
				amount: number;
		  }
	)[];
	feeRate?: number;
	publish?: boolean;
};

export type EdictRuneResponse = {
	psbt: string;
	txId?: string;
};

const RUNE_MAGIC_VALUE = 546;

export const edictRune = async (
	config: Config,
	{ transfers, feeRate: customFeeRate, publish, from }: EdictRuneParams,
): Promise<EdictRuneResponse> => {
	if (!config.currentConnection) {
		throw new Error("No connection");
	}

	if (!config.network) {
		throw new Error("No network");
	}

	await import("tiny-secp256k1").then(initEccLib);

	const { accounts } = config.getState();

	const ordinalsAccount = accounts?.find(
		(account) => account.purpose === AddressPurpose.Ordinals,
	);

	if (!ordinalsAccount) {
		throw new Error("No ordinals account");
	}

	const account = from
		? accounts?.find((account) => account.address === from)
		: accounts?.[0];

	if (!account) {
		throw new Error("No transfer account");
	}

	const network = networks[config.network.network];
	const feeRate = customFeeRate || (await getFeeRate(config)).hourFee;

	const utxos = await getUTXOs(config, account.address);
	const runeUTXOs: RuneUTXO[] = [];
	const outputs: TransferOutput[] = [];

	for (const transfer of transfers) {
		if ("runeId" in transfer) {
			const utxos = await getRuneUTXO(
				config,
				ordinalsAccount.address,
				transfer.runeId,
			);

			if (utxos.length === 0) {
				throw new Error("No ordinals UTXOs");
			}

			const selectedUTXOs = runeUTXOSelect(utxos, transfer.amount).filter(
				(utxo) => !runeUTXOs.some((runeUTXO) => runeUTXO.txid === utxo.txid),
			);

			runeUTXOs.push(...selectedUTXOs);
		} else {
			outputs.push({
				address: transfer.receiver,
				value: transfer.amount,
			});
		}
	}

	for (const receiver of Array.from(
		new Set(
			transfers
				.filter((t) => "runeId" in t)
				.map((transfer) => transfer.receiver),
		),
	)) {
		outputs.push({
			address: receiver,
			value: RUNE_MAGIC_VALUE,
		});
	}

	outputs.push({
		address: ordinalsAccount.address,
		value: RUNE_MAGIC_VALUE,
	});

	const selectedUTXOs = coinSelect(utxos, outputs, feeRate);

	if (
		!selectedUTXOs.inputs ||
		runeUTXOs.length === 0 ||
		!selectedUTXOs.outputs
	) {
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
					retry: { limit: 5 },
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

	const xOnly = extractXCoordinate(ordinalsAccount.publicKey);

	const ordinalsP2TR = payments.p2tr({
		internalPubkey: Buffer.from(xOnly, "hex"),
		network,
	});

	for (const utxo of runeUTXOs) {
		psbt.addInput({
			hash: utxo.txid,
			index: utxo.vout,
			witnessUtxo: {
				value: utxo.satoshis,
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				script: ordinalsP2TR.output!,
			},
			tapInternalKey: Buffer.from(xOnly, "hex"),
		});
	}

	for (const output of selectedUTXOs.outputs) {
		if (!output.address) {
			output.address = account.address;
		}

		psbt.addOutput(output as Parameters<typeof psbt.addOutput>[0]);
	}

	const edicts = transfers
		.filter((t) => "runeId" in t)
		.map((transfer) => {
			const [blockHeight, txIndex] = transfer.runeId.split(":").map(Number);

			return new Edict(
				new RuneId(blockHeight, txIndex),
				transfer.amount,
				psbt.txOutputs.findIndex(
					(t) =>
						transfer.receiver === t.address && t.value === RUNE_MAGIC_VALUE,
				),
			);
		});

	const changeIndex = psbt.txOutputs.findIndex(
		(it) =>
			it.address === ordinalsAccount.address && it.value === RUNE_MAGIC_VALUE,
	);

	const mintStone = new Runestone(edicts, none(), none(), some(changeIndex));

	psbt.addOutput({
		script: mintStone.encipher(),
		value: 0,
	});

	const psbtData = psbt.toBase64();

	const signInputs = {} as Record<string, number[]>;

	if (account.address !== ordinalsAccount.address) {
		signInputs[account.address] = selectedUTXOs.inputs.map(
			(_input, index) => index,
		);
		signInputs[ordinalsAccount.address] = runeUTXOs.map(
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			(_input, index) => (selectedUTXOs.inputs!.length ?? 0) + index,
		);
	} else {
		signInputs[account.address] = [...selectedUTXOs.inputs, ...runeUTXOs].map(
			(_input, index) => index,
		);
	}

	const data = await config.currentConnection.signPSBT({
		psbt: psbtData,
		signInputs,
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
