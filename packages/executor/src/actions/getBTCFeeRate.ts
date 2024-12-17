import type { Config } from "@midl-xyz/midl-js-core";
import type { Address, Client } from "viem";
import { readContract } from "viem/actions";
import { executorAddress } from "~/config";
import { executorAbi } from "~/contracts/abi";
import { AbstractProvider, ethers } from "ethers";

export type GetBTCFeeRateResponse = ReturnType<typeof getBTCFeeRateViem>;

const getBTCFeeRateEthers = (config: Config, provider: AbstractProvider) => {
	const contract = new ethers.Contract(
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		executorAddress[config.network!.id],
		executorAbi,
		provider,
	);

	return contract.btcFeeRate() as ReturnType<typeof getBTCFeeRateViem>;
};

const getBTCFeeRateViem = (config: Config, client: Client) => {
	return readContract(client, {
		// biome-ignore lint/style/noNonNullAssertion: executorAddress is defined
		address: executorAddress[config.network!.id] as Address,
		abi: executorAbi,
		functionName: "btcFeeRate",
	});
};

export const getBTCFeeRate = async (
	config: Config,
	client: Client | AbstractProvider,
) => {
	if (!config.network) {
		throw new Error("Network not set");
	}

	if (client instanceof AbstractProvider) {
		return getBTCFeeRateEthers(config, client);
	}

	return getBTCFeeRateViem(config, client);
};
