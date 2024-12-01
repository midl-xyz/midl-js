import { AddressPurpose } from "@midl-xyz/midl-js-core";
import {
	useIsMutating,
	useMutationState,
	useQuery,
} from "@tanstack/react-query";
import { useConfig } from "~/hooks/useConfig";
import { ConnectMutationKey } from "~/hooks/useConnect";

/**
 * Custom hook to manage user accounts.
 *
 * This hook fetches and provides access to the user's accounts, including ordinals and payment accounts.
 *
 * @example
 * ```typescript
 * const { accounts, ordinalsAccount, paymentAccount, status } = useAccounts();
 * ```
 *
 * @returns
 * - **accounts**: `Array<Account> | null` – The list of user accounts.
 * - **ordinalsAccount**: `Account | undefined` – The ordinals account.
 * - **paymentAccount**: `Account | undefined` – The payment account.
 * - **connector**: `Connector | undefined` – The current connection.
 * - **isConnecting**: `boolean` – Indicates if a connection is in progress.
 * - **isConnected**: `boolean` – Indicates if the connection has been established.
 * - **status**: `string` – The current connection status.
 * - **network**: `Network | undefined` – The connected network.
 * - **...rest**: `any` – Additional query state provided by `useQuery`.
 */
export const useAccounts = () => {

	const { currentConnection, network } = useConfig();

	const { data, status, ...rest } = useQuery({
		queryKey: ["accounts", currentConnection],
		queryFn: async () => {
			const data = await currentConnection?.getAccounts();
			return data ?? null;
		},
		enabled: !!currentConnection,
		retry: false,
	});

	const [mutationState] = useMutationState({
		filters: { mutationKey: [ConnectMutationKey] },
	});

	const isMutating = useIsMutating({
		mutationKey: [ConnectMutationKey],
	});

	const getStatus = () => {
		if (isMutating) {
			return "connecting";
		}

		if (mutationState?.status === "success") {
			return "connected";
		}

		return "disconnected";
	};

	const ordinalsAccount = data?.find(
		(it) => it.purpose === AddressPurpose.Ordinals,
	);
	const paymentAccount = data?.find(
		(it) => it.purpose === AddressPurpose.Payment,
	);

	return {
		accounts: data,
		ordinalsAccount,
		paymentAccount,
		connector: currentConnection,
		isConnecting: isMutating,
		isConnected: mutationState?.status === "success",
		status: getStatus(),
		network,
		...rest,
	};
};
