import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useConfig } from "~/hooks/useConfig";

type UseDisconnectParams = {
	mutation?: Omit<UseMutationOptions, "mutationFn">;
};

/**
 * Disconnects the app from the wallet.
 *
 * @example
 * ```typescript
 * const { disconnect } = useDisconnect();
 *
 * disconnect();
 * ```
 *
 * @param params - Configuration options for the mutation.
 *
 * @returns
 * - **disconnect**: `() => void` – Function to initiate disconnection.
 * - **disconnectAsync**: `() => Promise<void>` – Function to asynchronously disconnect.
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
