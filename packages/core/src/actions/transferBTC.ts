import ecc from "@bitcoinerlab/secp256k1";
import { Psbt, initEccLib, networks } from "bitcoinjs-lib";
import coinSelect, { type Target } from "bitcoinselect";
import { broadcastTransaction } from "~/actions/broadcastTransaction";
import { WalletConnectionError } from "~/actions/connect";
import { getFeeRate } from "~/actions/getFeeRate";
import { getUTXOs } from "~/actions/getUTXOs";
import { AddressPurpose } from "~/constants";
import type { Config } from "~/createConfig";
import { makePSBTInputs } from "~/utils";

initEccLib(ecc);

export type TransferBTCParams = {
	/**
	 * An array of transfers
	 */
	transfers: {
		/**
		 * The receiver address
		 */
		receiver: string;
		/**
		 * The amount in satoshis to transfer
		 */
		amount: number;
	}[];
	/**
	 * The fee rate in satoshis per byte
	 */
	feeRate?: number;
	/**
	 * If true, the transaction will be broadcasted
	 */
	publish?: boolean;
	/**
	 * The address to transfer the BTC from
	 */
	from?: string;
};

export type TransferBTCResponse = {
	/**
	 * Signed Base64 encoded PSBT
	 */
	psbt: string;
	/**
	 * The transaction
	 * */
	tx: {
		/**
		 * The transaction ID
		 */
		id: string;
		/**
		 * The transaction hex
		 */
		hex: string;
	};
};

/**
 * Creates a transfer BTC transaction without publishing to the network.
 * To publish the created PSBT pass the publish: true param.
 *
 * @example
 * ```ts
 * const tx = await transferBTC(config, {
 * 	transfers: [
 * 		{ receiver: "tb1q...", amount: 10000 },
 * 		{ receiver: "tb1q...", amount: 20000 },
 * 	],
 * 	feeRate: 1,
 * 	publish: true,
 * });
 *
 * console.log(tx);
 * ```
 *
 * @param config The configuration object
 * @param params The transfer BTC parameters
 * @returns The signed PSBT and transaction data
 */
export const transferBTC = async (
	config: Config,
	{ transfers, feeRate: customFeeRate, publish, from }: TransferBTCParams,
): Promise<TransferBTCResponse> => {
	const { connection, network: currentNetwork } = config.getState();

	if (!connection) {
		throw new WalletConnectionError();
	}

	const { accounts } = config.getState();

	const account = from
		? accounts?.find((account) => account.address === from)
		: accounts?.find((account) => account.purpose === AddressPurpose.Payment) ||
			accounts?.[0];

	if (!account) {
		throw new Error("No account found for the specified address.");
	}

	const network = networks[currentNetwork.network];
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

	const data = await connection.signPSBT(
		{
			psbt: psbtData,
			signInputs: {
				[account.address]: selectedUTXOs.inputs.map((_input, index) => index),
			},
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
