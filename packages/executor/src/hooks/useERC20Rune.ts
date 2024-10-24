import deployment from "@midl-xyz/contracts/deployments/0.0.1/Executor.json";
import { useRune } from "@midl-xyz/midl-js-react";
import { type UseReadContractParameters, useReadContract } from "wagmi";
import { executorAbi } from "~/contracts/abi";
import { runeIdToBytes32 } from "~/utils";

type UseERC20Params = {
	query?: NonNullable<
		UseReadContractParameters<typeof executorAbi, "btcCMidlAddresses">["query"]
	>;
};

export const useERC20Rune = (
	runeId: string,
	{ query }: UseERC20Params = {},
) => {
	const { rune, ...rest } = useRune({ runeId });
	const bytes32RuneId = runeIdToBytes32(rune?.id ?? "");

	const { data: erc20Address, ...erc20rest } = useReadContract({
		abi: executorAbi,
		functionName: "btcCMidlAddresses",
		// TODO: address depends on the network
		address: deployment.address as `0x${string}`,
		contractType: 1,
		args: [bytes32RuneId],
		query: {
			enabled: query?.enabled ? query.enabled : !!rune,
			...query,
		},
	});

	return {
		state: rest,
		erc20State: erc20rest,
		rune,
		erc20Address,
	};
};
