import { useAccounts, useConfig } from "@midl-xyz/midl-js-react";
import { zeroAddress } from "viem";
import type { Address } from "viem/accounts";
import { usePublicKey } from "~/hooks/usePublicKey";
import { getEVMAddress } from "~/utils/getEVMAddress";

type UseEVMAddressParams = {
	publicKey?: Address;
};

export const useEVMAddress = ({ publicKey }: UseEVMAddressParams = {}) => {
	const { ordinalsAccount, paymentAccount } = useAccounts();
	const config = useConfig();
	const pk = usePublicKey({
		publicKey:
			publicKey ??
			(paymentAccount?.publicKey as `0x${string}`) ??
			(ordinalsAccount?.publicKey as `0x${string}`),
	});

	try {
		if (!pk || !config.network) {
			return zeroAddress;
		}

		return getEVMAddress(pk);
	} catch (e) {
		return zeroAddress;
	}
};
