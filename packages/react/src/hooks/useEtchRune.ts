import { etchRune } from "@midl-xyz/midl-js-core";
import { useMutation } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

export const useEtchRune = () => {
  const { config } = useMidlContext();

  return useMutation({
    mutationKey: ["etchRune"],
    mutationFn: () => {
      return etchRune(config, {
        name: "MYAMAZINGRUNE",
        content: "Hello, Midl!",
        amount: 1000,
        cap: 10000,
        symbol: "$",
      });
    },
  });
};
