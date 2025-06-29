import { MidlProvider } from "@midl-xyz/midl-js-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { midlConfig } from "~/__tests__/midlConfig";
import { wagmiConfig } from "~/__tests__/wagmiConfig";
import { WagmiMidlProvider } from "~/providers";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			experimental_prefetchInRender: true,
		},
	},
});

export const wrapper = ({ children }: { children: ReactNode }) => {
	return (
		<MidlProvider config={midlConfig}>
			<WagmiProvider config={wagmiConfig}>
				<QueryClientProvider client={queryClient}>
					<WagmiMidlProvider />
					{children}
				</QueryClientProvider>
			</WagmiProvider>
		</MidlProvider>
	);
};
