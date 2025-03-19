import { AddressPurpose } from "@midl-xyz/midl-js-core";
import { useIsMutating, useQuery } from "@tanstack/react-query";
import { useConfig } from "~/hooks/useConfig";
import { ConnectMutationKey } from "~/hooks/useConnect";

/**
 * Provides access to the connected user's accounts.
 * *
 * @example
 * ```typescript
 * const { accounts, ordinalsAccount, paymentAccount, status } = useAccounts();
 * ```
 *
 * @returns
 * - **accounts**: `Array<Account> | null` – The list of user accounts.
 * - **ordinalsAccount**: `Account | undefined` – The ordinals account (p2tr)
 * - **paymentAccount**: `Account | undefined` – The payment account (p2wpkh)
 * - **connector**: `Connector | undefined` – The current connection.
 * - **isConnecting**: `boolean` – Indicates if a connection is in progress.
 * - **isConnected**: `boolean` – Indicates if the connection has been established.
 * - **status**: `string` – The current connection status.
 * - **network**: `BitcoinNetwork | undefined` – The connected network.
 * - **...rest**: `any` – Additional query state provided by `useQuery`.
 */
export const useAccounts = () => {
	const { accounts, connection, network } = useConfig();

	const { data, status, ...rest } = useQuery({
		queryKey: ["accounts", connection],
		queryFn: async () => {
			return accounts;
		},
		enabled: !!connection,
		retry: false,
	});

	const isMutating = useIsMutating({
		mutationKey: [ConnectMutationKey],
	});

	const getStatus = () => {
		if (!data && (isMutating || status === "pending")) {
			return "pending";
		}

		// biome-ignore lint/style/noNonNullAssertion: This is a valid check
		if (Boolean(data) && data!.length > 0) {
			return "success";
		}

		return "disconnected";
	};

	const ordinalsAccount = data?.find(
		(it) => it.purpose === AddressPurpose.Ordinals,
	);
	const paymentAccount = data?.find(
		(it) => it.purpose === AddressPurpose.Payment,
	);

	const currentStatus = getStatus();

	return {
		accounts: data,
		ordinalsAccount,
		paymentAccount,
		connector: connection,
		isConnecting: currentStatus === "pending",
		isConnected: currentStatus === "success",
		status: getStatus(),
		network,
		...rest,
	};
};
