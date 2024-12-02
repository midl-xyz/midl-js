import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useConfig } from "~/hooks/useConfig";

type UseDisconnectParams = {
	mutation?: Omit<UseMutationOptions, "mutationFn">;
};

/**
 * Custom hook to manage disconnection from the current connector.
 *
 * This hook provides functions to disconnect the current connection and handles the mutation state.
 *
 * @example
 * ```typescript
 * const { disconnect, disconnectAsync } = useDisconnect();
 * 
 * // To disconnect
 * disconnect();
 * 
 * // To disconnect asynchronously
 * await disconnectAsync();
 * ```
 *
 * @param {UseDisconnectParams} [params] - Configuration options for the mutation.
 *
 * @returns
 * - **disconnect**: `() => void` – Function to initiate disconnection.
 * - **disconnectAsync**: `() => Promise<void>` – Function to asynchronously disconnect.
 * - **isLoading**: `boolean` – Indicates if the mutation is currently loading.
 * - **error**: `Error | null` – Contains error information if the mutation failed.
 */
export const useDisconnect = ({ mutation }: UseDisconnectParams = {}) => {
	const config = useConfig();

	const { mutate, mutateAsync, ...rest } = useMutation({
		mutationFn: async () => {
			return config.currentConnection?.disconnect();
		},
		...mutation,
	});

	return {
		disconnect: mutate,
		disconnectAsync: mutateAsync,
		...rest,
	};
};
