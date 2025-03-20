import { AddressPurpose } from "@midl-xyz/midl-js-core";
import { createContext, useContext, type ReactNode } from "react";

type SatoshiKitContext = {
	purposes: AddressPurpose[];
};

const context = createContext<SatoshiKitContext>(
	{} as unknown as SatoshiKitContext,
);

type SatoshiKitProviderProps = {
	purposes?: AddressPurpose[];
	children: ReactNode;
};

export const useSatoshiKit = () => {
	return useContext(context);
};

export const SatoshiKitProvider = ({
	children,
	purposes = [AddressPurpose.Payment, AddressPurpose.Ordinals],
}: SatoshiKitProviderProps) => {
	return (
		<context.Provider
			value={{
				purposes,
			}}
		>
			{children}
		</context.Provider>
	);
};
