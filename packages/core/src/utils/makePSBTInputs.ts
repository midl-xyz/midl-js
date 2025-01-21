import { networks, payments, type Psbt } from "bitcoinjs-lib";
import type { UTXO } from "bitcoinselect";
import type { Account } from "~/connectors";
import { AddressType } from "~/constants";
import type { Config } from "~/createConfig";
import { extractXCoordinate } from "~/utils/extractXCoordinate";
import axios from "axios";

type PSBTInput = Parameters<typeof Psbt.prototype.addInput>[0];

/**
 * Helper function to add inputs depending on the address type.
 *
 * @param config - The configuration object.
 * @param account - The account object.
 * @param inputs - The UTXOs to add as inputs.
 */
export const makePSBTInputs = async (
	config: Config,
	account: Account,
	utxos: UTXO[],
): Promise<PSBTInput[]> => {
	if (!config.network) {
		throw new Error("No network");
	}

	const network = networks[config.network.network];
	const inputs: PSBTInput[] = [];

	switch (account.addressType) {
		case AddressType.P2SH: {
			const { redeem } = payments.p2sh({
				redeem: payments.p2wpkh({
					pubkey: Buffer.from(account.publicKey, "hex"),
					network,
				}),
				network,
			});

			for (const utxo of utxos) {
				const { data: hex } = await axios.get(
					`${config.network.rpcUrl}/tx/${utxo.txid}/hex`,
				);

				inputs.push({
					hash: utxo.txid as string,
					index: utxo.vout,
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

			for (const utxo of utxos) {
				inputs.push({
					hash: utxo.txid as string,
					index: utxo.vout,
					witnessUtxo: {
						// biome-ignore lint/style/noNonNullAssertion: Output is defined
						script: p2tr.output!,
						value: BigInt(utxo.value),
					},
					tapInternalKey: xOnly,
				});
			}

			break;
		}

		case AddressType.P2WPKH: {
			const p2wpkh = payments.p2wpkh({
				pubkey: Buffer.from(account.publicKey, "hex"),
				network,
			});

			for (const utxo of utxos) {
				inputs.push({
					hash: utxo.txid as string,
					index: utxo.vout,
					witnessUtxo: {
						// biome-ignore lint/style/noNonNullAssertion: Output is defined
						script: p2wpkh.output!,
						value: BigInt(utxo.value),
					},
				});
			}

			break;
		}

		default: {
			throw new Error("Unknown address type");
		}
	}

	return inputs;
};
