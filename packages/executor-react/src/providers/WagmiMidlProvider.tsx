"use client";

import { useEffect, useMemo } from "react";
import { zeroAddress } from "viem";
import { useAccount, useConnect, useSwitchChain } from "wagmi";
import { mock } from "wagmi/connectors";
import { useEVMAddress, useEVMChain } from "~/hooks";

/**
 * Provider to automatically connect to the EVM chain with the EVM address for the current BTC wallet.
 */
export const WagmiMidlProvider = () => {
	const evmAddress = useEVMAddress();
	const chain = useEVMChain();
	const { switchChain } = useSwitchChain();
	const { connect } = useConnect();
	const { address } = useAccount();

	const connector = useMemo(() => {
		return mock({
			accounts: [evmAddress],
			features: { defaultConnected: true },
		});
	}, [evmAddress]);

	useEffect(() => {
		if (!evmAddress || evmAddress === zeroAddress || evmAddress === address) {
			return;
		}

		connect({
			connector,
		});

		if (chain) {
			switchChain({ chainId: chain.id });
		} else {
			console.error("Chain not found");
		}
	}, [evmAddress, connector, address, connect, chain, switchChain]);

	return null;
};
