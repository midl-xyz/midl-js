import deployment from "@midl-xyz/contracts/deployments/0.0.1/Executor.json";
import { mock } from "@wagmi/connectors";
import { type UseReadContractParameters, useReadContract } from "wagmi";
import { executorAbi } from "~/contracts/abi";

type UseLastBlockParams = {
  query?: NonNullable<
    UseReadContractParameters<typeof executorAbi, "lastBlockNum">["query"]
  >;
};

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
