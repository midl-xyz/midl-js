import { useRune } from "@midl-xyz/midl-js-react";
import { useReadContract, type UseReadContractParameters } from "wagmi";
import deployment from "@midl-xyz/contracts/deployments/0.0.1/ExecutorMidl.json";
import { executorMidlAbi } from "~/contracts/abi";
import { toHex, pad } from "viem";

type UseERC20Params = {
  query?: NonNullable<
    UseReadContractParameters<
      typeof executorMidlAbi,
      "btcMidlAddresses"
    >["query"]
  >;
};

export const useERC20Rune = (
  runeId: string,
  { query }: UseERC20Params = {}
) => {
  const { rune, ...rest } = useRune({ runeId });

  const [blockHeight = "0", txIndex = "0"] = runeId.split(":");

  let bytes32RuneId: `0x${string}` = pad("0x0", { size: 32 });

  try {
    bytes32RuneId = pad(
      toHex((BigInt(blockHeight) << BigInt(32)) | BigInt(txIndex)),
      { size: 32 }
    );
  } catch (e) {
    // do nothing
  }

  const { data: erc20Address, ...erc20rest } = useReadContract({
    abi: executorMidlAbi,
    functionName: "btcMidlAddresses",
    // TODO: address depends on the network
    address: deployment.address as `0x${string}`,
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
