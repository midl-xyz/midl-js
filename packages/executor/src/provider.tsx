import { mock } from "wagmi/connectors";
import { useEffect } from "react";
import { useConnect, useSwitchChain } from "wagmi";
import { useEVMAddress, useEVMChain } from "~/hooks";

export const WagmiMidlProvider = () => {
	const evmAddress = useEVMAddress();
	const chain = useEVMChain();
	const { switchChain } = useSwitchChain();
	const { connect } = useConnect();

	useEffect(() => {
		connect({ connector: mock({ accounts: [evmAddress] }) });

		if (chain) {
			switchChain({ chainId: chain.id });
		} else {
			console.error("Chain not found");
		}
	}, [evmAddress, connect, chain, switchChain]);

	return null;
};
