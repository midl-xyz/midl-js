import type { Client } from "viem";
import { readContract } from "viem/actions";
import { SystemContracts } from "~/config";
import { globalParamsAbi } from "~/contracts/abi";
import { ceilDiv } from "~/utils";

export type GetBTCFeeRateResponse = bigint;

/**
 * Gets the BTC fee rate defined in the Executor contract.
 *
 * @param client - EVM client or provider.
 * @returns The BTC fee rate.
 *
 * @example
 * const feeRate = await getBTCFeeRate(client);
 */
export const getBTCFeeRate = async (client: Client) => {
	const feeRate = await readContract(client, {
		address: SystemContracts.GlobalParams,
		abi: globalParamsAbi,
		functionName: "btcFeeRate",
	});

	return ceilDiv(feeRate as bigint, 1000n);
};
