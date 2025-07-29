import {
	type Config,
	type NetworkConfig,
	addNetwork,
} from "@midl-xyz/midl-js-core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useConfigInternal } from "~/hooks/useConfigInternal";

type UseAddNetworkVariables = {
	connectorId: string;
	networkConfig: NetworkConfig;
};

type UseAddNetworkData = Awaited<ReturnType<typeof addNetwork>>;

type UseAddNetworkError = Error;

export type UseAddNetworkParams = {
	config?: Config;
	mutation?: Omit<
		UseMutationOptions<
			UseAddNetworkData,
			UseAddNetworkError,
			UseAddNetworkVariables
		>,
		"mutationFn"
	>;
};

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
