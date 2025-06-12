"use client";

import type { Chain } from "@midl-xyz/midl-js-executor";
import { useEffect, useMemo } from "react";
import { zeroAddress } from "viem";
import { useAccount, useConnect, useSwitchChain } from "wagmi";
import { mock } from "wagmi/connectors";
import { useEVMAddress, useEVMChain } from "~/hooks";

type WagmiMidlProviderProps = {
	chain?: Chain;
};

/**
 * Provider to automatically connect to the EVM chain with the EVM address for the current BTC wallet.
 */
export const WagmiMidlProvider = ({
	chain: customChain,
}: WagmiMidlProviderProps) => {
	const evmAddress = useEVMAddress();
	const chain = useEVMChain({ chain: customChain });
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
			chainId: chain?.id,
		});

		if (chain) {
			switchChain({ chainId: chain.id });
		} else {
			console.error("Chain not found");
		}
	}, [evmAddress, connector, address, connect, chain, switchChain]);

	return null;
};
