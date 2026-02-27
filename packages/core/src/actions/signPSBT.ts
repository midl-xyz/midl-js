import { networks, Psbt } from "bitcoinjs-lib";
import { broadcastTransaction } from "~/actions/broadcastTransaction";
import { WalletConnectionError } from "~/actions/connect";
import type { Config } from "~/createConfig";

export type SignPSBTParams = {
	/**
	 * Base64 encoded PSBT to sign
	 */
	psbt: string;
	/**
	 * The inputs to sign, in the format `{ [address]: [inputIndex] }`
	 */
	signInputs: Record<string, number[]>;
	/**
	 * If true, the transaction will be broadcasted
	 */
	publish?: boolean;
	/**
	 * If true, tweaking the signer will be disabled for the supported connectors
	 */
	disableTweakSigner?: boolean;
};

export type SignPSBTResponse = {
	/**
	 * Signed Base64 encoded PSBT
	 */
	psbt: string;
	/**
	 * The transaction ID, if the transaction was broadcasted
	 */
	txId?: string;
};

/**
 * Signs a base64 encoded bitcoin PSBT.
 * By default the transaction is not published to the network.
 *
 * @example
 * ```ts
 * const signedPSBT = await signPSBT(config, {
 * 	psbt: "cHNidP8BA..."
 * 	signInputs: {
 * 		"tpubD6NzVbkrYh...": [0]
 * 	}
 * });
 *
 * console.log(signedPSBT);
 * ```
 *
 * @param config The configuration object
 * @param params The sign PSBT parameters
 * @returns Base64-encoded signed PSBT
 */
export const signPSBT = async (
	config: Config,
	params: SignPSBTParams,
): Promise<SignPSBTResponse> => {
	const { connection, network } = config.getState();

	if (!connection) {
		throw new WalletConnectionError();
	}

	const signedPSBT = await connection.signPSBT(params, network);

	if (params.publish) {
		const bitcoinNetwork = networks[network.network];
		const psbt = Psbt.fromBase64(signedPSBT.psbt, { network: bitcoinNetwork });

		psbt.finalizeAllInputs();

		const txId = await broadcastTransaction(
			config,
			psbt.extractTransaction().toHex(),
		);

		return { psbt: psbt.toBase64(), txId };
	}

	return signedPSBT;
};
