import { type Config, getDefaultAccount, getRune } from "@midl/core";
import { encodeFunctionData } from "viem";
import { addTxIntention } from "~/actions/addTxIntention";
import { SystemContracts } from "~/config";
import { executorAbi } from "~/contracts";
import { runeIdToBytes32, satoshisToWei } from "~/utils";

export const RUNE_MAPPING_FEE = 10 ** 4;

export type AddRequestAddAssetIntentionParams = {
	/**
	 * ERC20 contract address
	 */
	address: `0x${string}`;
	/**
	 * The rune ID to associate with the asset
	 */
	runeId: string;
	/**
	 * ERC20 contract deployment transaction hash
	 */
	transactionHash: `0x${string}`;
};

type AddRequestAddAssetIntentionOptions = {
	/**
	 * The BTC address to use for the intention
	 */
	from?: string;
};

export const addRequestAddAssetIntention = async (
	config: Config,
	{ address, runeId, transactionHash }: AddRequestAddAssetIntentionParams,
	{ from }: AddRequestAddAssetIntentionOptions = {},
) => {
	const rune = await getRune(config, runeId);

	if (!rune.supply?.premine) {
		throw new Error(`Rune with ID ${runeId} has no supply information`);
	}

	return addTxIntention(
		config,
		{
			evmTransaction: {
				to: SystemContracts.Executor,
				data: encodeFunctionData({
					abi: executorAbi,
					functionName: "requestAddAsset",
					args: [address, runeIdToBytes32(rune.id), transactionHash],
				}),
				value: satoshisToWei(RUNE_MAPPING_FEE),
			},
			deposit: {
				satoshis: RUNE_MAPPING_FEE,
				runes: [
					{
						id: rune.id,
						amount: rune.supply.premine,
						address,
					},
				],
			},
		},
		from,
	);
};
