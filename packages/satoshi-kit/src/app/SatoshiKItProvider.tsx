import { Toaster } from "@ark-ui/react";
import { AddressPurpose, type Config } from "@midl-xyz/midl-js-core";
import { useConfigInternal } from "@midl-xyz/midl-js-react";
import { XIcon } from "lucide-react";
import { type ReactNode, createContext, useContext, useEffect } from "react";
import type { AuthenticationAdapter } from "~/features/auth";
import { useToaster } from "~/shared";
import { IconButton } from "~/shared/ui/icon-button";
import { Toast } from "~/shared/ui/toast";

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
	const toaster = useToaster();

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
		<>
			<context.Provider
				value={{
					purposes,
					authenticationAdapter: authenticationAdapter ?? null,
					config,
				}}
			>
				{children}
			</context.Provider>
			<Toaster toaster={toaster}>
				{(toast) => (
					<Toast.Root key={toast.id}>
						<Toast.Title>{toast.title}</Toast.Title>
						<Toast.Description>{toast.description}</Toast.Description>
						{toast.action && (
							<Toast.ActionTrigger>{toast.action?.label}</Toast.ActionTrigger>
						)}

						{toast.closable && (
							<Toast.CloseTrigger asChild>
								<IconButton size="sm" variant="link">
									<XIcon />
								</IconButton>
							</Toast.CloseTrigger>
						)}
					</Toast.Root>
				)}
			</Toaster>
		</>
	);
};
