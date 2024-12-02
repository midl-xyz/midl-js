import deployment from "@midl-xyz/contracts/deployments/0.0.1/Executor.json";
import { type UseReadContractParameters, useReadContract } from "wagmi";
import { executorAbi } from "~/contracts/abi";

type UseLastBlockParams = {
  query?: NonNullable<
    UseReadContractParameters<typeof executorAbi, "lastBlockNum">["query"]
  >;
};

/**
 * Custom hook to retrieve the last block number from the Executor contract.
 *
 * This hook calls the `lastBlockNum` function of the Executor smart contract to obtain the most recent block number.
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
 * @param {UseLastBlockParams} [params] - Optional parameters for the contract call.
 * @param {boolean} [params.query.enabled] - Whether the query is enabled.
 *
 * @returns
 * - **lastBlock**: `number | undefined` – The last block number retrieved from the contract.
 * - Other properties from `useReadContract` such as `isLoading`, `error`, etc.
 */
export const useLastBlock = ({ query }: UseLastBlockParams = {}) => {
  const { data: lastBlock, ...rest } = useReadContract({
    abi: executorAbi,
    functionName: "lastBlockNum",
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
