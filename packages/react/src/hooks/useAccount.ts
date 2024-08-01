import { useQuery } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

export const useAccount = () => {
  const {
    config: { currentConnection },
  } = useMidlContext();

  return useQuery({
    queryKey: ["account", currentConnection],
    queryFn: async () => {
      const data = await currentConnection?.getAccounts();

      return data ?? null;
    },
    enabled: !!currentConnection,
  });
};
