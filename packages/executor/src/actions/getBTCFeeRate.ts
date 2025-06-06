import type { Config } from "@midl-xyz/midl-js-core";
import type { Address, Client } from "viem";
import { readContract } from "viem/actions";
import { executorAddress } from "~/config";
import { executorAbi } from "~/contracts/abi";

export type GetBTCFeeRateResponse = ReturnType<typeof getBTCFeeRateViem>;

const getBTCFeeRateViem = (config: Config, client: Client) => {
	const { network } = config.getState();

	return readContract(client, {
		// biome-ignore lint/style/noNonNullAssertion: executorAddress is defined
		address: executorAddress[network!.id] as Address,
		abi: executorAbi,
		functionName: "btcFeeRate",
	});
};

/**
 * Gets the BTC Fee rate defined in the executor contract
 *
 * @param config The configuration object
 * @param client EVM client or provider
 * @returns The BTC fee rate
 */
export const getBTCFeeRate = async (config: Config, client: Client) => {
	const { network } = config.getState();

	if (!network) {
		throw new Error("Network not set");
	}

	return getBTCFeeRateViem(config, client as Client);
};
