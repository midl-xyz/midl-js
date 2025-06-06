import { type Config, disconnect } from "@midl-xyz/midl-js-core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useConfigInternal } from "~/hooks/useConfigInternal";

type UseDisconnectParams = {
	mutation?: Omit<UseMutationOptions, "mutationFn">;
	config?: Config;
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
export const useDisconnect = ({
	mutation,
	config: customConfig,
}: UseDisconnectParams = {}) => {
	const config = useConfigInternal(customConfig);

	const { mutate, mutateAsync, ...rest } = useMutation({
		mutationFn: async () => {
			return disconnect(config);
		},
		...mutation,
	});

	return {
		disconnect: mutate,
		disconnectAsync: mutateAsync,
		...rest,
	};
};
