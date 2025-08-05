import {
	type Config,
	type NetworkConfig,
	addNetwork,
} from "@midl-xyz/midl-js-core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useConfigInternal } from "~/hooks/useConfigInternal";

type UseAddNetworkVariables = {
	/**
	 * The ID of the connector to which the network will be added.
	 */
	connectorId: string;
	/**
	 * The network configuration to add.
	 */
	networkConfig: NetworkConfig;
};

type UseAddNetworkData = Awaited<ReturnType<typeof addNetwork>>;

type UseAddNetworkError = Error;

export type UseAddNetworkParams = {
	/**
	 * Config object to use instead of the one from context.
	 */
	config?: Config;
	/**
	 * Mutation options for react-query.
	 */
	mutation?: Omit<
		UseMutationOptions<
			UseAddNetworkData,
			UseAddNetworkError,
			UseAddNetworkVariables
		>,
		"mutationFn"
	>;
};

/**
 * Adds a new network configuration to a connector.
 *
 * @example
 * ```typescript
 * const { addNetwork, addNetworkAsync } = useAddNetwork();
 * addNetwork({ connectorId: 'my-connector', networkConfig: { id: 'testnet', name: 'Testnet', rpcUrl: 'https://...' } });
 * ```
 *
 * @param params - Optional configuration and mutation options.
 *
 * @returns
 * - **addNetwork**: Function to initiate adding a network.
 * - **addNetworkAsync**: Function to asynchronously add a network.
 * - ...rest: Additional mutation state from useMutation.
 */

export const useAddNetwork = ({
	mutation,
	config: customConfig,
}: UseAddNetworkParams = {}) => {
	const config = useConfigInternal(customConfig);

	const { mutate, mutateAsync, ...rest } = useMutation<
		UseAddNetworkData,
		UseAddNetworkError,
		UseAddNetworkVariables
	>({
		mutationFn: async ({ connectorId, networkConfig }) => {
			return addNetwork(config, connectorId, networkConfig);
		},
		...mutation,
	});

	return {
		addNetwork: mutate,
		addNetworkAsync: mutateAsync,
		...rest,
	};
};
