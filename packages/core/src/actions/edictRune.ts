import ecc from "@bitcoinerlab/secp256k1";
import { Edict, RuneId, Runestone, none, some } from "@midl/runelib";
import { Psbt, initEccLib, networks } from "bitcoinjs-lib";
import coinSelect from "bitcoinselect";
import { getDefaultAccount } from "~/actions";
import { broadcastTransaction } from "~/actions/broadcastTransaction";
import { getFeeRate } from "~/actions/getFeeRate";
import { getRuneUTXO } from "~/actions/getRuneUTXO";
import { getUTXOs } from "~/actions/getUTXOs";
import { AddressPurpose } from "~/constants";
import type { Config } from "~/createConfig";
import type { RuneUTXO } from "~/providers";
import { makePSBTInputs, runeUTXOSelect } from "~/utils";

initEccLib(ecc);

type TransferOutput = {
	address: string;
	value: number;
};

export type EdictRuneParams = {
	/**
	 * The address to transfer the rune from
	 */
	from?: string;
	/**
	 * An array of transfers, supporting both rune and bitcoin transfers
	 */
	transfers: (
		| {
				/**
				 * The rune ID, in the format `blockHeight:txIndex`
				 */
				runeId: string;
				/**
				 * The amount to transfer
				 */
				amount: bigint;
				/**
				 * The receiver address
				 */
				receiver: string;
		  }
		| {
				/**
				 * The receiver address
				 * */
				receiver: string;
				/**
				 *The amount in satoshis to transfer
				 */
				amount: number;
		  }
	)[];
	/**
	 * The fee rate in satoshis per byte
	 */
	feeRate?: number;
	/**
	 * If true, the transaction will be broadcasted
	 */
	publish?: boolean;
};

export type EdictRuneResponse = {
	/**
	 * Base64-encoded PSBT data
	 */
	psbt: string;
	/**
	 * The transaction data
	 */
	tx: {
		/**
		 * The transaction hash
		 */
		id: string;
		/**
		 * The transaction hex
		 * */
		hex: string;
	};
};

const RUNE_MAGIC_VALUE = 546;

/**
 * Edicts (transfers) one or more runes to one or more receivers
 *
 * @example
 * ```ts
 * edictRune(config, {
 * 	transfers: [
 * 		{
 * 			runeId: "1:1",
 * 			amount: 100n,
 * 			receiver: "tb1q9zj...zj9q"
 * 		},
 * 	]
 * });
 * ```
 *
 * @param config The configuration object
 * @param params Edict rune parameters
 * @returns The PSBT and transaction data
 */
export const edictRune = async (
	config: Config,
	{ transfers, feeRate: customFeeRate, publish, from }: EdictRuneParams,
): Promise<EdictRuneResponse> => {
	const { connection, network: currentNetwork, accounts } = config.getState();

	if (!connection) {
		throw new Error("No connection");
	}

	if (!currentNetwork) {
		throw new Error("No network");
	}

	const runesAccount =
		accounts?.find((account) => {
			if (from) {
				return account.address === from;
			}

			return account.purpose === AddressPurpose.Ordinals;
		}) ?? getDefaultAccount(config);

	const paymentAccount = getDefaultAccount(
		config,
		from ? (account) => account.address === from : undefined,
	);

	const network = networks[currentNetwork.network];
	const feeRate = customFeeRate || (await getFeeRate(config)).hourFee;

	const utxos = await getUTXOs(config, paymentAccount.address);
	const runeUTXOs: RuneUTXO[] = [];
	const outputs: TransferOutput[] = [];

	for (const transfer of transfers) {
		if ("runeId" in transfer) {
			const utxos = await getRuneUTXO(
				config,
				runesAccount.address,
				transfer.runeId,
			);

			if (utxos.length === 0) {
				throw new Error("No ordinals UTXOs");
			}

			const selectedUTXOs = runeUTXOSelect(
				utxos,
				transfer.runeId,
				transfer.amount,
			).filter(
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
		address: runesAccount.address,
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

	const inputs = await makePSBTInputs(
		config,
		paymentAccount,
		selectedUTXOs.inputs,
	);

	psbt.addInputs(inputs);

	const runeInputs = await makePSBTInputs(
		config,
		runesAccount,
		runeUTXOs.map((utxo) => ({
			txid: utxo.txid,
			vout: utxo.vout,
			value: utxo.satoshis,
		})),
	);

	psbt.addInputs(runeInputs);

	for (const output of selectedUTXOs.outputs) {
		if (!output.address) {
			output.address = paymentAccount.address;
		}

		psbt.addOutput({
			...output,
			value: output.value ? BigInt(output.value) : 0n,
		} as Parameters<typeof psbt.addOutput>[0]);
	}

	const edicts = transfers
		.filter((t) => "runeId" in t)
		.map((transfer) => {
			const [blockHeight, txIndex] = transfer.runeId.split(":").map(Number);
			const outputIndex = psbt.txOutputs.findIndex(
				(t) =>
					transfer.receiver === t.address &&
					t.value === BigInt(RUNE_MAGIC_VALUE),
			);

			if (outputIndex === -1) {
				throw new Error(`No output for ${transfer.receiver}`);
			}

			return new Edict(
				new RuneId(blockHeight, txIndex),
				transfer.amount,
				outputIndex,
			);
		});

	const changeIndex = psbt.txOutputs.findIndex(
		(it) =>
			it.address === runesAccount.address &&
			it.value === BigInt(RUNE_MAGIC_VALUE),
	);

	const mintStone = new Runestone(edicts, none(), none(), some(changeIndex));

	psbt.addOutput({
		script: mintStone.encipher(),
		value: 0n,
	});

	const psbtData = psbt.toBase64();
	const signInputs = {} as Record<string, number[]>;

	if (paymentAccount.address !== runesAccount.address) {
		signInputs[paymentAccount.address] = selectedUTXOs.inputs.map(
			(_input, index) => index,
		);
		signInputs[runesAccount.address] = runeUTXOs.map(
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			(_input, index) => (selectedUTXOs.inputs!.length ?? 0) + index,
		);
	} else {
		signInputs[paymentAccount.address] = [
			...selectedUTXOs.inputs,
			...runeUTXOs,
		].map((_input, index) => index);
	}

	const data = await connection.signPSBT(
		{
			psbt: psbtData,
			signInputs,
		},
		currentNetwork,
	);

	const signedPSBT = Psbt.fromBase64(data.psbt, {
		network,
	});

	signedPSBT.finalizeAllInputs();

	const psbtBase64 = signedPSBT.toBase64();

	if (publish) {
		const hex = signedPSBT.extractTransaction().toHex();

		const txId = await broadcastTransaction(config, hex);

		return {
			psbt: psbtBase64,
			tx: {
				id: txId,
				hex,
			},
		};
	}

	const tx = signedPSBT.extractTransaction();

	return {
		psbt: psbtBase64,
		tx: {
			id: tx.getId(),
			hex: tx.toHex(),
		},
	};
};
