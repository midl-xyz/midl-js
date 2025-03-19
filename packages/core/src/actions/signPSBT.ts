import { Psbt, networks } from "bitcoinjs-lib";
import { broadcastTransaction } from "~/actions/broadcastTransaction";
import type { Config } from "~/createConfig";

export type SignPSBTParams = {
	/**
	 * Base64 encoded PSBT to sign
	 */
	psbt: string;
	/**
	 * The inputs to sign, in the format `{ pubkey: [inputIndex] }`
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
 * Signs a PSBT
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
 * @returns The signed PSBT
 */
export const signPSBT = async (
	config: Config,
	params: SignPSBTParams,
): Promise<SignPSBTResponse> => {
	const { connection, network } = config.getState();

	if (!connection) {
		throw new Error("No provider found");
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
