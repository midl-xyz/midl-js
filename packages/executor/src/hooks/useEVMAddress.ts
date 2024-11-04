import { useAccounts, useMidlContext } from "@midl-xyz/midl-js-react";
import { zeroAddress } from "viem";
import type { Address } from "viem/accounts";
import { useP2TRPublicKey } from "~/hooks/useP2TRPublicKey";
import { getEVMAddress } from "~/utils/getEVMAddress";

type UseEVMAddressParams = {
	publicKey?: Address;
};

export const useEVMAddress = ({ publicKey }: UseEVMAddressParams = {}) => {
	const { ordinalsAccount } = useAccounts();
	const { config } = useMidlContext();
	const pk = useP2TRPublicKey({
		publicKey: publicKey ?? (ordinalsAccount?.publicKey as `0x${string}`),
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
