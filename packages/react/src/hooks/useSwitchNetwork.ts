import { type BitcoinNetwork, switchNetwork } from "@midl-xyz/midl-js-core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useMidlContext } from "~/context";
import { useConfig } from "~/hooks/useConfig";

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

/**
 * Switches between different Bitcoin networks as configured.
 *
 * @example
 * ```typescript
 * const { switchNetwork } = useSwitchNetwork();
 *
 * // To switch to a specific network
 * switchNetwork(mainnet);
 * ```
 *
 * @param params Configuration options for the mutation.
 *
 * @returns
 * - `switchNetwork`: `(variables: SwitchNetworkVariables) => void` – Function to initiate a network switch.
 * - `switchNetworkAsync`: `(variables: SwitchNetworkVariables) => Promise<SwitchNetworkData>` – Function to asynchronously switch networks.
 * - `networks`: `Array<BitcoinNetwork>` – The list of available Bitcoin networks.
 */
export const useSwitchNetwork = ({ mutation }: UseSwitchNetworkParams = {}) => {
	const { config } = useMidlContext();
	const { networks } = useConfig();

	const { mutate, mutateAsync, ...rest } = useMutation<
		SwitchNetworkData,
		SwitchNetworkError,
		SwitchNetworkVariables
	>({
		mutationFn: async (network) => {
			switchNetwork(config, network);
		},
		...mutation,
	});

	return {
		switchNetwork: mutate,
		switchNetworkAsync: mutateAsync,
		networks,
		...rest,
	};
};
