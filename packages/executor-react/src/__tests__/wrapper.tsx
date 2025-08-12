import { MidlProvider } from "@midl-xyz/midl-js-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { midlConfig } from "~/__tests__/midlConfig";
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
		<QueryClientProvider client={queryClient}>
			<MidlProvider config={midlConfig}>
				<WagmiMidlProvider>{children}</WagmiMidlProvider>
			</MidlProvider>
		</QueryClientProvider>
	);
};
