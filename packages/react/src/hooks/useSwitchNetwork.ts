import { type BitcoinNetwork, switchNetwork } from "@midl-xyz/midl-js-core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

type SwitchNetworkError = undefined;
type SwitchNetworkData = undefined;
type SwitchNetworkVariables = BitcoinNetwork;

type UseSwitchNetworkParams = {
  mutation?: Omit<
    UseMutationOptions<
      SwitchNetworkData,
      SwitchNetworkError,
      SwitchNetworkVariables
    >,
    "mutationFn"
  >;
};

export const useSwitchNetwork = ({ mutation }: UseSwitchNetworkParams = {}) => {
  const { config } = useMidlContext();

  const { mutate, mutateAsync, ...rest } = useMutation<
    SwitchNetworkData,
    SwitchNetworkError,
    SwitchNetworkVariables
  >({
    mutationFn: async network => {
      switchNetwork(config, network);
    },
    ...mutation,
  });

  return {
    switchNetwork: mutate,
    switchNetworkAsync: mutateAsync,
    networks: config.networks,
    ...rest,
  };
};
