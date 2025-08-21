import deployment from "@midl/contracts/deployments/0.1.1/Executor.json";
import { executorAbi } from "@midl/executor";
import { type UseReadContractParameters, useReadContract } from "wagmi";

type UseLastBlockParams = {
	query?: NonNullable<
		UseReadContractParameters<
			typeof executorAbi,
			"lastCommittedMidlBlock"
		>["query"]
	>;
};

/**
 * Retrieve last BTC block processed by the executor contract.
 *
 * @example
 * ```typescript
 * const { lastBlock, isLoading } = useLastBlock();
 *
 * if (lastBlock) {
 *   console.log(`Last block number: ${lastBlock}`);
 * }
 * ```
 *
 * @returns
 * - **lastBlock**: `number | undefined` – The last block number retrieved from the contract.
 * - Other properties from `useReadContract` such as `isLoading`, `error`, etc.
 */
export const useLastBlock = ({ query }: UseLastBlockParams = {}) => {
	const { data: lastBlock, ...rest } = useReadContract({
		abi: executorAbi,
		functionName: "lastCommittedMidlBlock",
		contractType: 1,
		// TODO: address depends on the network
		address: deployment.address as `0x${string}`,
		query: {
			...query,
		},
	});

	return {
		lastBlock,
		...rest,
	};
};
