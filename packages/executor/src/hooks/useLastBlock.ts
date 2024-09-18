import deployment from "@midl-xyz/contracts/deployments/0.0.1/ExecutorMidl.json";
import { type UseReadContractParameters, useReadContract } from "wagmi";
import { executorMidlAbi } from "~/contracts/abi";

type UseLastBlockParams = {
  query?: NonNullable<
    UseReadContractParameters<typeof executorMidlAbi, "lastBlockNum">["query"]
  >;
};

export const useLastBlock = ({ query }: UseLastBlockParams = {}) => {
  const { data: lastBlock, ...rest } = useReadContract({
    abi: executorMidlAbi,
    functionName: "lastBlockNum",
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
