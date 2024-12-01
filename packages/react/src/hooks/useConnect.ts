import type { ConnectParams, Connector } from "@midl-xyz/midl-js-core";
import {
	type DefaultError,
	type UseMutationOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { useConfig } from "~/hooks/useConfig";

type ConnectData = Awaited<ReturnType<Connector["connect"]>>;

type ConnectError = DefaultError;

type ConnectVariables = {
	/**
	 * The id of the connector to use.
	 */
	id?: string;
};

type UseConnectParams = ConnectParams & {
	mutation?: Omit<
		UseMutationOptions<ConnectData, ConnectError, ConnectVariables>,
		"mutationFn"
	>;
};

export const ConnectMutationKey = "connect";

/**
 * Custom hook to manage connection to a connector.
 *
 * This hook provides functions to connect to a specified connector and manages the connection state.
 *
 * @example
 * ```typescript
 * const { connect, connectAsync, connectors, status } = useConnect({ id: 'connector-id' });
 * 
 * // To initiate a connection
 * connect({ id: 'connector-id' });
 * 
 * // To initiate a connection asynchronously
 * await connectAsync({ id: 'connector-id' });
 * ```
 *
 * @param {UseConnectParams} params - Parameters for establishing the connection.
 *
 * @returns
 * - **connect**: `(variables: ConnectVariables) => void` – Function to initiate connection.
 * - **connectAsync**: `(variables: ConnectVariables) => Promise<ConnectData>` – Function to asynchronously connect.
 * - **connectors**: `Array<Connector>` – The list of available connectors.
 * - **isLoading**: `boolean` – Indicates if the mutation is currently loading.
 * - **error**: `ConnectError | null` – Contains error information if the mutation failed.
 * - **data**: `ConnectData | undefined` – The response data from the connection.
 */
export const useConnect = ({
	mutation: { onSuccess, ...mutationOptions } = {},
	...params
}: UseConnectParams) => {
	const config = useConfig();
	const queryClient = useQueryClient();

	const mutation = useMutation<ConnectData, ConnectError, ConnectVariables>({
		mutationKey: [ConnectMutationKey],
		onSuccess: (...args) => {
			onSuccess?.(...args);
			queryClient.invalidateQueries({ queryKey: ["accounts"] });
		},
		mutationFn: async ({ id }) => {
			const connector =
				config.connectors.find((connector) => connector.id === id) ??
				config.connectors[0];

			return connector.connect(params);
		},
		...mutationOptions,
	});

	const { mutate, mutateAsync, ...rest } = mutation;

	return {
		connect: mutation.mutate,
		connectAsync: mutation.mutateAsync,
		connectors: config.connectors,
		...rest,
	};
};
