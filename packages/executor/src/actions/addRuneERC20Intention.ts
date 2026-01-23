import {
	type Config,
	getBlockNumber,
	getDefaultAccount,
	getRune,
} from "@midl/core";
import { addTxIntention } from "~/actions/addTxIntention";
import { getEVMAddress } from "~/utils";

/**
 * Creates an intention to add a Rune ERC20 token by transferring the minting fee and the Rune to the multisig address.
 *
 * @param config - The configuration object.
 * @param runeId - The name or ID of the Rune to be added.
 *
 * @returns The transaction intention
 *
 * @throws Will throw an error if the rune has less than 6 confirmations.
 */
export const addRuneERC20Intention = async (config: Config, runeId: string) => {
	const rune = await getRune(config, runeId);

	const blockHeight = await getBlockNumber(config);
	const evmAddress = getEVMAddress(
		getDefaultAccount(config),
		config.getState().network,
	);

	if (
		rune.location?.block_height &&
		blockHeight - rune.location.block_height < 6
	) {
		throw new Error("Confirmations must be at least 6");
	}

	const intention = await addTxIntention(config, {
		evmTransaction: {
			to: evmAddress,
			value: 0n,
			gas: 21000n,
		},
		deposit: {
			runes: [
				{
					id: runeId,
					amount: 1n,
				},
			],
		},
	});

	return intention;
};
