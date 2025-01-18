import { Psbt, initEccLib, networks } from "bitcoinjs-lib";
import coinSelect, { type Target } from "bitcoinselect";
import { broadcastTransaction } from "~/actions/broadcastTransaction";
import { getFeeRate } from "~/actions/getFeeRate";
import { getUTXOs } from "~/actions/getUTXOs";
import type { Config } from "~/createConfig";
import { makePSBTInputs } from "~/utils";
import ecc from "@bitcoinerlab/secp256k1";

initEccLib(ecc);

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
	tx: {
		id: string;
		hex: string;
	};
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
	const outputs: Target[] = [];

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

	const inputs = await makePSBTInputs(config, account, selectedUTXOs.inputs);

	if (inputs.length === 0) {
		throw new Error("No inputs");
	}

	psbt.addInputs(inputs);

	for (const output of selectedUTXOs.outputs) {
		if (!output.address) {
			output.address = account.address;
		}

		psbt.addOutput({
			...output,
			value: output.value ? BigInt(output.value) : 0n,
		} as Parameters<typeof psbt.addOutput>[0]);
	}

	const psbtData = psbt.toBase64();

	const data = await config.currentConnection.signPSBT({
		psbt: psbtData,
		signInputs: {
			[account.address]: selectedUTXOs.inputs.map((_input, index) => index),
		},
	});

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
			tx: { id: txId, hex },
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
