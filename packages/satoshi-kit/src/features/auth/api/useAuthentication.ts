import { useConfig, useSignMessage } from "@midl-xyz/midl-js-react";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useSatoshiKit } from "~/app";

type UseAuthenticationParams = {
	signInMutation?: Omit<UseMutationOptions<void, Error, string>, "mutationFn">;
	signOutMutation?: Omit<UseMutationOptions<void, Error, void>, "mutationFn">;
};

export const useAuthentication = ({
	signInMutation,
	signOutMutation,
}: UseAuthenticationParams = {}) => {
	const { authenticationAdapter, config } = useSatoshiKit();
	const { signMessageAsync } = useSignMessage({ config });
	const { network } = useConfig(config);

	const {
		mutate: signIn,
		mutateAsync: signInAsync,
		...signInState
	} = useMutation({
		mutationFn: async (address: string) => {
			if (!authenticationAdapter) {
				throw new Error("No authentication adapter provided");
			}

			const { message, signMessageProtocol } =
				await authenticationAdapter.createMessage(address, network);

			const { signature } = await signMessageAsync({
				message,
				address,
				protocol: signMessageProtocol,
			});

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
		...signOutMutation,
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
