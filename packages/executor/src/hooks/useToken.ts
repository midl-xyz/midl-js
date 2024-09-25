import deployment from "@midl-xyz/contracts/deployments/0.0.1/Executor.json";
import { useRune } from "@midl-xyz/midl-js-react";
import type { Address } from "viem";
import { type UseReadContractParameters, useReadContract } from "wagmi";
import { executorAbi } from "~/contracts/abi";
import { bytes32toRuneId } from "~/utils";

type UseERC20Params = {
  query?: NonNullable<
    UseReadContractParameters<typeof executorAbi, "cMidlBtcAddresses">["query"]
  >;
};

export const useToken = (address: Address, { query }: UseERC20Params = {}) => {
  const { data: bytes32RuneId, ...bytes32State } = useReadContract({
    abi: executorAbi,
    functionName: "cMidlBtcAddresses",
    // TODO: address depends on the network
    address: deployment.address as `0x${string}`,
    contractType: 1,
    args: [address],
    query: {
      enabled: query?.enabled ? query.enabled : !!address,
      ...query,
    },
  });

  let runeId = "";

  try {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    runeId = bytes32toRuneId(bytes32RuneId!);
  } catch (e) {
    // do nothing
  }

  const { rune, ...rest } = useRune({ runeId });

  return {
    state: rest,
    bytes32State,
    bytes32RuneId,
    rune,
  };
};
