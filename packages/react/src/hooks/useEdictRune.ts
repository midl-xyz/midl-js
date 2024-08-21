import { edictRune, type EdictRuneParams } from "@midl-xyz/midl-js-core";
import { useMutation } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

export const useEdictRune = () => {
  const { config } = useMidlContext();

  return useMutation({
    mutationKey: ["edictRune"],
    mutationFn: async (params: EdictRuneParams) => {
      return edictRune(config, params);
    },
  });
};
