import { useConfig } from "@midl-xyz/midl-js-react";
import { getEVMFromBitcoinNetwork } from "~/utils";

export const useEVMChain = () => {
	const { network } = useConfig();

	return network ? getEVMFromBitcoinNetwork(network) : null;
};
