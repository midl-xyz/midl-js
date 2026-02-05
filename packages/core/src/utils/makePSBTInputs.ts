import { hexToBytes } from "@noble/hashes/utils.js";
import { type Psbt, networks, payments } from "bitcoinjs-lib";
import type { UTXO } from "bitcoinselect";
import type { Account } from "~/connectors/index.js";
import { AddressType } from "~/constants/index.js";
import type { Config } from "~/createConfig.js";
import { extractXCoordinate } from "~/utils/extractXCoordinate.js";

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
	const { network: currentNetwork, provider } = config.getState();

	if (!currentNetwork) {
		throw new Error("No network");
	}

	const network = networks[currentNetwork.network];
	const inputs: PSBTInput[] = [];

	switch (account.addressType) {
		case AddressType.P2SH_P2WPKH: {
			const { redeem } = payments.p2sh({
				redeem: payments.p2wpkh({
					pubkey: hexToBytes(account.publicKey),
					network,
				}),
				network,
			});

			for (const utxo of utxos) {
				const hex = await provider.getTransactionHex(
					currentNetwork,
					utxo.txid as string,
				);

				inputs.push({
					hash: utxo.txid as string,
					index: utxo.vout,
					nonWitnessUtxo: hexToBytes(hex),
					redeemScript: redeem?.output,
				});
			}

			break;
		}

		case AddressType.P2TR: {
			const xOnly = hexToBytes(extractXCoordinate(account.publicKey));

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
				pubkey: hexToBytes(account.publicKey),
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
