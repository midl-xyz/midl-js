import { Toaster } from "@ark-ui/react";
import { AddressPurpose } from "@midl-xyz/midl-js-core";
import { useConfig } from "@midl-xyz/midl-js-react";
import { XIcon } from "lucide-react";
import { createContext, useContext, useEffect, type ReactNode } from "react";
import type { AuthenticationAdapter } from "~/feature/auth";
import { useToaster } from "~/shared";
import { IconButton } from "~/shared/ui/icon-button";
import { Toast } from "~/shared/ui/toast";

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
	const { accounts } = useConfig();
	const toaster = useToaster();

	useEffect(() => {
		if (!authenticationAdapter) {
			return;
		}

		if (!accounts || accounts.length === 0) {
			authenticationAdapter.signOut();
		}
	}, [accounts, authenticationAdapter]);

	return (
		<>
			<context.Provider
				value={{
					purposes,
					authenticationAdapter: authenticationAdapter ?? null,
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
