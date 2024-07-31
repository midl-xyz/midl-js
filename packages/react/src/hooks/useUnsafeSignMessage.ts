import { unsafeSignMessage } from "@midl-xyz/midl-js-core";
import { useMutation } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

export const useUnsafeSignMessage = () => {
  const { config } = useMidlContext();

  return useMutation({
    mutationFn: async (message: string) => {
      return unsafeSignMessage(config, { message });
    },
  });
};
