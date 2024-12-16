import type { Config } from "@midl-xyz/midl-js-core";
import type { Address } from "viem";
import { readContract } from "viem/actions";
import { executorAddress } from "~/config";
import { executorAbi } from "~/contracts/abi";

export const getBTCFeeRate = async (config: Config) => {
	if (!config.network) {
		throw new Error("Network not set");
	}

	return readContract(client, {
		abi: executorAbi,
		address: executorAddress[config.network.id] as Address,
		functionName: "btcFeeRate",
	});
};
