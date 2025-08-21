import { AddressPurpose, type Config } from "@midl/core";
import { useConfigInternal } from "@midl/react";
import { type ReactNode, createContext, useContext, useEffect } from "react";
import type { AuthenticationAdapter } from "~/features/auth";

type SatoshiKitContext = {
	purposes: AddressPurpose[];
	authenticationAdapter: AuthenticationAdapter | null;
	config: Config;
};

const context = createContext<SatoshiKitContext>(
	{} as unknown as SatoshiKitContext,
);

type SatoshiKitProviderProps = {
	children: ReactNode;
	purposes?: AddressPurpose[];
	authenticationAdapter?: AuthenticationAdapter;
	config?: Config;
};

export const useSatoshiKit = () => {
	return useContext(context);
};

export const SatoshiKitProvider = ({
	children,
	authenticationAdapter,
	config: customConfig,
	purposes = [AddressPurpose.Payment, AddressPurpose.Ordinals],
}: SatoshiKitProviderProps) => {
	const config = useConfigInternal(customConfig);

	useEffect(() => {
		config.subscribe((state, prevState) => {
			if (
				typeof state.connection === "undefined" &&
				typeof prevState.connection !== "undefined"
			) {
				authenticationAdapter?.signOut();
			}
		});
	}, [config, authenticationAdapter]);

	return (
		<context.Provider
			value={{
				purposes,
				authenticationAdapter: authenticationAdapter ?? null,
				config,
			}}
		>
			{children}
		</context.Provider>
	);
};
