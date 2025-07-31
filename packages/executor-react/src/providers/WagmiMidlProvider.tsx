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

	const connector = useMemo(() => {
		return mock({
			accounts: [evmAddress],
			features: { defaultConnected: true },
		});
	}, [evmAddress]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: No need to re-run on function changes
	useEffect(() => {
		if (!evmAddress || evmAddress === zeroAddress) {
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
	}, [evmAddress, connector, chain]);

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
					[evmChain.id]: http(evmChain.rpcUrls.default.http[0]),
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
