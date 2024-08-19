import { useQuery } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

export const useAccounts = () => {
  const {
    config: { currentConnection },
  } = useMidlContext();

  return useQuery({
    queryKey: ["accounts", currentConnection],
    queryFn: async () => {
      const data = await currentConnection?.getAccounts();
      return data ?? null;
    },
    enabled: !!currentConnection,
    retry: false,
  });
};
