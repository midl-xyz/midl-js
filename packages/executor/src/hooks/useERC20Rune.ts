import { useRune } from "@midl-xyz/midl-js-react";
import { useReadContract } from "wagmi";
import deployment from "@midl-xyz/contracts/deployments/0.0.1/ExecutorMidl.json";
import { executorMidlAbi } from "~/contracts/abi";
import { toHex, pad } from "viem";

export const useERC20Rune = (runeId: string) => {
  const { rune, ...rest } = useRune({ runeId });

  const [blockHeight = "0", txIndex = "0"] = runeId.split(":");

  const bytes32RuneId = pad(
    toHex((BigInt(blockHeight) << BigInt(32)) | BigInt(txIndex)),
    { size: 32 }
  );

  const { data: erc20Address, ...erc20rest } = useReadContract({
    abi: executorMidlAbi,
    functionName: "btcMidlAddresses",
    // TODO: address depends on the network
    address: deployment.address as `0x${string}`,
    args: [bytes32RuneId],
    query: {
      enabled: !!rune,
    },
  });

  return {
    state: rest,
    erc20State: erc20rest,
    rune,
    erc20Address,
  };
};
