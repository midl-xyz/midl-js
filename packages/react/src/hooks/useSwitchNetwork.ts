import { type BitcoinNetwork, type Config, switchNetwork } from "@midl/core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useConfig } from "~/hooks/useConfig";
import { useConfigInternal } from "~/hooks/useConfigInternal";

type SwitchNetworkError = undefined;
type SwitchNetworkData = undefined;
type SwitchNetworkVariables = BitcoinNetwork;

type UseSwitchNetworkParams = {
	/**
	 * Mutation options for the switch network operation.
	 */
	mutation?: Omit<
		UseMutationOptions<
			SwitchNetworkData,
			SwitchNetworkError,
			SwitchNetworkVariables
		>,
		"mutationFn"
	>;
	/**
	 * Custom configuration to override the default.
	 */
	config?: Config;
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
export const useSwitchNetwork = ({
	mutation,
	config: customConfig,
}: UseSwitchNetworkParams = {}) => {
	const config = useConfigInternal(customConfig);
	const { networks } = useConfig(customConfig);

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
