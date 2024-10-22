import { useMutation } from "@tanstack/react-query";
import { useMidlContext } from "~/context";
import { type BitcoinNetwork, switchNetwork } from "@midl-xyz/midl-js-core";

export const useSwitchNetwork = () => {
  const { config } = useMidlContext();

  const mutation = useMutation<void, void, BitcoinNetwork>({
    mutationFn: async network => {
      switchNetwork(config, network);
    },
  });

  return {
    switchNetwork: mutation.mutate,
    switchNetworkAsync: mutation.mutateAsync,
    networks: config.networks,
    ...mutation,
  };
};
