import {
  useIsMutating,
  useMutationState,
  useQuery,
} from "@tanstack/react-query";
import { useMidlContext } from "~/context";
import { ConnectMutationKey } from "~/hooks/useConnect";

export const useAccounts = () => {
  const {
    config: { currentConnection, network, chain },
  } = useMidlContext();

  const { data, status, ...rest } = useQuery({
    queryKey: ["accounts", currentConnection],
    queryFn: async () => {
      const data = await currentConnection?.getAccounts();
      return data ?? null;
    },
    enabled: !!currentConnection,
    retry: false,
  });

  const [mutationState] = useMutationState({
    filters: { mutationKey: [ConnectMutationKey] },
  });

  const isMutating = useIsMutating({
    mutationKey: [ConnectMutationKey],
  });

  const getStatus = () => {
    if (isMutating) {
      return "connecting";
    }

    if (mutationState?.status === "success") {
      return "connected";
    }

    return "disconnected";
  };

  return {
    accounts: data,
    connector: currentConnection,
    isConnecting: isMutating,
    isConnected: mutationState?.status === "success",
    status: getStatus(),
    network,
    chain,
    ...rest,
  };
};
