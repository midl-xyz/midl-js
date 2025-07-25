"use client";

import {
	type Chain,
	getEVMFromBitcoinNetwork,
} from "@midl-xyz/midl-js-executor";
import { useConfig } from "@midl-xyz/midl-js-react";
import { useEffect, useMemo } from "react";
import { http, zeroAddress } from "viem";
import {
	WagmiProvider,
	createConfig,
	useAccount,
	useConnect,
	useSwitchChain,
} from "wagmi";
import { mock } from "wagmi/connectors";
import { useEVMAddress, useEVMChain } from "~/hooks";

type WagmiMidlProviderProps = {
	chain?: Chain;
	children?: React.ReactNode;
	config?: Parameters<typeof createConfig>[0];
};

/**
 * Provider to automatically connect to the EVM chain with the EVM address for the current BTC wallet.
 */
export const WagmiAutoConnect = () => {
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

export const WagmiMidlProvider = ({
	chain,
	children,
	config: customConfig,
}: WagmiMidlProviderProps) => {
	const { network } = useConfig();

	const config = useMemo(() => {
		const evmChain = chain ?? getEVMFromBitcoinNetwork(network);

		return createConfig(
			customConfig ?? {
				chains: [evmChain],
				transports: {
					[network.id]: http(evmChain.rpcUrls.default.http[0]),
				},
				multiInjectedProviderDiscovery: false,
				ssr: false,
			},
		);
	}, [chain, customConfig, network]);

	return (
		<WagmiProvider config={config}>
			<WagmiAutoConnect />

			{children}
		</WagmiProvider>
	);
};
