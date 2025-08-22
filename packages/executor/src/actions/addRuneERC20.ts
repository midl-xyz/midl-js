import { type Config, edictRune, getBlockNumber, getRune } from "@midl/core";
import type { Client } from "viem";
import { getBTCFeeRate } from "~/actions/getBTCFeeRate";
import { multisigAddress } from "~/config";
import { calculateTransactionsCost } from "~/utils";

/**
 * Adds a Rune to the Midl network.
 * Transfers the minting fee and the Rune to the multisig address.
 *
 * @param config - The configuration object.
 * @param client - The viem client.
 * @param runeId - The name or ID of the Rune to be added.
 * @param options - Optional parameters.
 * @param options.publish - If true, the transaction will be published to the network.
 *
 * @returns The transaction details including PSBT and transaction hex.
 *
 * @throws Will throw an error if the rune name is less than 12 characters or if it has less than 6 confirmations.
 *
 * @example
 * const result = await addRuneERC20(config, client, "RUNE1234567890", { publish: true });
 * console.log(result.tx.id); // Transaction ID
 * console.log(result.psbt); // PSBT data
 * console.log(result.tx.hex); // Transaction hex
 */
export const addRuneERC20 = async (
	config: Config,
	client: Client,
	runeId: string,
	{ publish }: { publish?: boolean } = {},
) => {
	const { network } = config.getState();

	const rune = await getRune(config, runeId);

	if (rune.name.length < 12) {
		throw new Error("Rune name must be at least 12 characters long");
	}

	const blockHeight = await getBlockNumber(config);

	if (blockHeight - rune.location.block_height < 6) {
		throw new Error("Confirmations must be at least 6");
	}

	const feeRate = await getBTCFeeRate(config, client);

	const mintFee = calculateTransactionsCost(0n, {
		feeRate: Number(feeRate),
		hasRunesDeposit: true,
	});

	const tx = await edictRune(config, {
		transfers: [
			{
				receiver: multisigAddress[network.id],
				amount: mintFee,
			},
			{
				runeId,
				amount: 1n,
				receiver: multisigAddress[network.id],
			},
		],
		publish,
	});

	return tx;
};
