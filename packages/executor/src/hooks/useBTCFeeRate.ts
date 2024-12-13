import { useConfig } from "@midl-xyz/midl-js-react";
import type { Address } from "viem";
import { useReadContract } from "wagmi";
import { executorAddress } from "~/config";
import { executorAbi } from "~/contracts/abi";

export const useBTCFeeRate = () => {
	const config = useConfig();

	return useReadContract({
		abi: executorAbi,
		// biome-ignore lint/style/noNonNullAssertion: disabled if the network is not set
		address: executorAddress[config.network!.id] as Address,
		functionName: "btcFeeRate",
		query: {
			enabled: Boolean(config.network),
		},
	});
};
