import { AddressPurpose } from "@midl-xyz/midl-js-core";
import {
	useIsMutating,
	useMutationState,
	useQuery,
} from "@tanstack/react-query";
import { useConfig } from "~/hooks/useConfig";
import { ConnectMutationKey } from "~/hooks/useConnect";

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
