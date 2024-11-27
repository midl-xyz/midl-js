import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useConfig } from "~/hooks/useConfig";

type UseDisconnectParams = {
	mutation?: Omit<UseMutationOptions, "mutationFn">;
};

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
