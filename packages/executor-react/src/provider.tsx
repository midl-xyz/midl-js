"use client";

import type { Chain } from "@midl-xyz/midl-js-executor";
import { useEffect } from "react";
import { zeroAddress } from "viem";
import { useConnect, useSwitchChain } from "wagmi";
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

	useEffect(() => {
		if (!evmAddress || evmAddress === zeroAddress) {
			return;
		}

		connect({
			connector: mock({
				accounts: [evmAddress],
				features: { defaultConnected: true },
			}),
			chainId: chain?.id,
		});

		if (chain) {
			switchChain({ chainId: chain.id });
		} else {
			console.error("Chain not found");
		}
	}, [evmAddress, connect, chain, switchChain]);

	return null;
};
