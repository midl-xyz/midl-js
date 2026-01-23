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
	 * Amount of the rune to deposit
	 */
	amount: bigint;
};

type AddRequestAddAssetIntentionOptions = {
	/**
	 * The BTC address to use for the intention
	 */
	from?: string;
};

/**
 * Creates an intention to request adding a new ERC20 asset backed by a Rune.
 * Prepares an EVM transaction that calls `requestAddAsset` on the Executor
 * and adds a matching Rune deposit for the mapping fee.
 *
 * @param config - The configuration object.
 * @param params - The request parameters (ERC20 address, rune ID, and amount).
 * @param options - Optional BTC address to use for the intention.
 * @returns The created transaction intention.
 *
 * @example
 * const intention = await addRequestAddAssetIntention(config, {
 *   address: "0x0000000000000000000000000000000000000000",
 *   runeId: "840000:1",
 *   amount: 1000000n,
 * });
 */
export const addRequestAddAssetIntention = async (
	config: Config,
	{ address, runeId, amount }: AddRequestAddAssetIntentionParams,
	{ from }: AddRequestAddAssetIntentionOptions = {},
) => {
	return addTxIntention(
		config,
		{
			evmTransaction: {
				to: SystemContracts.Executor,
				data: encodeFunctionData({
					abi: executorAbi,
					functionName: "requestAddAsset",
					args: [address, runeIdToBytes32(runeId)],
				}),
				value: satoshisToWei(RUNE_MAPPING_FEE),
			},
			deposit: {
				satoshis: RUNE_MAPPING_FEE,
				runes: [
					{
						id: runeId,
						amount,
						address,
					},
				],
			},
		},
		from,
	);
};
