import type { Client } from "viem";
import { readContract } from "viem/actions";
import { SystemContracts } from "~/config";
import { globalParamsAbi } from "~/contracts/abi";

export type GetBTCFeeRateResponse = bigint;

/**
 * Gets the BTC fee rate defined in the Executor contract.
 *
 * @param config - The configuration object.
 * @param client - EVM client or provider.
 * @returns The BTC fee rate.
 *
 * @example
 * const feeRate = await getBTCFeeRate(config, client);
 */
export const getBTCFeeRate = async (client: Client) => {
	return readContract(client, {
		address: SystemContracts.GlobalParams,
		abi: globalParamsAbi,
		functionName: "btcFeeRate",
	});
};
