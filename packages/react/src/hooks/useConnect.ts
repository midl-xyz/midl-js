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
 * - **connectors**: `Array<Connector>` – The list of available connectors.
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
