import { AddressPurpose } from "@midl-xyz/midl-js-core";
import { createContext, useContext, type ReactNode } from "react";
import type { AuthenticationAdapter } from "~/feature/auth";

type SatoshiKitContext = {
	purposes: AddressPurpose[];
	authenticationAdapter: AuthenticationAdapter | null;
};

const context = createContext<SatoshiKitContext>(
	{} as unknown as SatoshiKitContext,
);

type SatoshiKitProviderProps = {
	purposes?: AddressPurpose[];
	authenticationAdapter?: AuthenticationAdapter;
	children: ReactNode;
};

export const useSatoshiKit = () => {
	return useContext(context);
};

export const SatoshiKitProvider = ({
	children,
	authenticationAdapter,
	purposes = [AddressPurpose.Payment, AddressPurpose.Ordinals],
}: SatoshiKitProviderProps) => {
	return (
		<context.Provider
			value={{
				purposes,
				authenticationAdapter: authenticationAdapter ?? null,
			}}
		>
			{children}
		</context.Provider>
	);
};
