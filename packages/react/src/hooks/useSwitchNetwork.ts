import { type BitcoinNetwork, switchNetwork } from "@midl-xyz/midl-js-core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
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
 * Custom hook to switch the current Bitcoin network.
 *
 * This hook provides functions to switch between different Bitcoin networks as configured.
 *
 * @example
 * ```typescript
 * const { switchNetwork, networks } = useSwitchNetwork();
 * 
 * // To switch to a specific network
 * switchNetwork(BitcoinNetwork.Mainnet);
 * ```
 *
 * @param {UseSwitchNetworkParams} [params] - Configuration options for the mutation.
 *
 * @returns
 * - `switchNetwork`: `(variables: SwitchNetworkVariables) => void` – Function to initiate a network switch.
 * - `switchNetworkAsync`: `(variables: SwitchNetworkVariables) => Promise<SwitchNetworkData>` – Function to asynchronously switch networks.
 * - `networks`: `Array<BitcoinNetwork>` – The list of available Bitcoin networks.
 * - `isLoading`: `boolean` – Indicates if the mutation is currently loading.
 * - `error`: `undefined` – Contains error information if the mutation failed.
 */
export const useSwitchNetwork = ({ mutation }: UseSwitchNetworkParams = {}) => {
	const config = useConfig();

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
		networks: config.networks,
		...rest,
	};
};
