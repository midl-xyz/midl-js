import {
	type Config,
	type ConnectParams,
	type Connector,
	connect,
} from "@midl-xyz/midl-js-core";
import {
	type DefaultError,
	type UseMutationOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { useConfig } from "~/hooks/useConfig";
import { useConfigInternal } from "~/hooks/useConfigInternal";

type ConnectData = Awaited<ReturnType<Connector["connect"]>>;

type ConnectError = DefaultError;

type ConnectVariables = {
	/**
	 * The id of the connector to use.
	 */
	id?: string;
};

type UseConnectParams = ConnectParams & {
	/**
	 * Optional mutation options for the connect operation.
	 */
	mutation?: Omit<
		UseMutationOptions<ConnectData, ConnectError, ConnectVariables>,
		"mutationFn"
	>;
	/**
	 * Optional custom configuration to override the default.
	 */
	config?: Config;
};

export const ConnectMutationKey = "connect";

/**
 * Connects to a wallet using the specified connector.
 *
 * @example
 * ```typescript
 * const { connect } = useConnect();
 *
 * connect({ id: 'connector-id' });
 * ```
 *
 * @param params Configuration for useConnect.
 *
 * @returns
 * - **connect**: `(variables: ConnectVariables) => void` – Function to initiate connection.
 * - **connectAsync**: `(variables: ConnectVariables) => Promise<ConnectData>` – Function to asynchronously connect.
 * - **connectors**:  The list of available connectors.
 * - **rest**: Other properties from the mutation object, such as `isLoading`, `error`, etc.
 */
export const useConnect = ({
	mutation: { onSuccess, ...mutationOptions } = {},
	config: customConfig,
	...params
}: UseConnectParams) => {
	const config = useConfigInternal(customConfig);
	const queryClient = useQueryClient();

	const { connectors } = useConfig(customConfig);

	const mutation = useMutation<ConnectData, ConnectError, ConnectVariables>({
		mutationKey: [ConnectMutationKey],
		onSuccess: (...args) => {
			onSuccess?.(...args);
			queryClient.invalidateQueries({ queryKey: ["accounts"] });
		},
		mutationFn: async ({ id }) => {
			return connect(config, params, id);
		},
		...mutationOptions,
	});

	const { mutate, mutateAsync, ...rest } = mutation;

	return {
		connect: mutation.mutate,
		connectAsync: mutation.mutateAsync,
		connectors,
		...rest,
	};
};
