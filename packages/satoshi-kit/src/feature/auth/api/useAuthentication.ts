import {
	useAccounts,
	useConfig,
	useSignMessage,
} from "@midl-xyz/midl-js-react";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useSatoshiKit } from "~/app";

type UseAuthenticationParams = {
	signInMutation?: Omit<UseMutationOptions<void, Error, string>, "mutationFn">;
};

export const useAuthentication = ({
	signInMutation,
}: UseAuthenticationParams = {}) => {
	const { authenticationAdapter } = useSatoshiKit();
	const { signMessageAsync } = useSignMessage();
	const { network } = useConfig();

	const {
		mutate: signIn,
		mutateAsync: signInAsync,
		...signInState
	} = useMutation({
		mutationFn: async (address: string) => {
			if (!authenticationAdapter) {
				throw new Error("No authentication adapter provided");
			}

			const message = await authenticationAdapter.createMessage(
				address,
				network,
			);

			const { signature } = await signMessageAsync({ message, address });

			const isValid = await authenticationAdapter.verify({
				message,
				signature,
				address,
			});

			if (!isValid) {
				throw new Error("Invalid signature");
			}
		},
		...signInMutation,
	});

	const {
		mutate: signOut,
		mutateAsync: signOutAsync,
		...signOutState
	} = useMutation({
		mutationFn: async () => {
			if (!authenticationAdapter) {
				throw new Error("No authentication adapter provided");
			}

			await authenticationAdapter.signOut();
		},
	});

	return {
		adapter: authenticationAdapter,
		signIn,
		signInAsync,
		signOut,
		signOutAsync,
		signInState,
		signOutState,
	};
};
