import type { Config } from "@midl-xyz/midl-js-core";
import type { JsonRpcProvider } from "ethers";
import type { Address, Client } from "viem";
import { readContract } from "viem/actions";
import { executorAddress } from "~/config";
import { executorAbi } from "~/contracts/abi";

export type GetBTCFeeRateResponse = ReturnType<typeof getBTCFeeRateViem>;

const getBTCFeeRateEthers = async (
	config: Config,
	provider: JsonRpcProvider,
) => {
	const { Contract } = await import("ethers");

	const contract = new Contract(
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

/**
 * Gets the BTC Fee rate defined in the executor contract
 *
 * @param config The configuration object
 * @param client EVM client or provider
 * @returns The BTC fee rate
 */
export const getBTCFeeRate = async (
	config: Config,
	client: Client | JsonRpcProvider,
) => {
	if (!config.network) {
		throw new Error("Network not set");
	}

	try {
		const { JsonRpcProvider } = await import("ethers");

		if (client instanceof JsonRpcProvider) {
			return getBTCFeeRateEthers(config, client);
		}
	} catch {}

	return getBTCFeeRateViem(config, client as Client);
};
