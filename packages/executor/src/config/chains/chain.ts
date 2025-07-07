import { Chain as ViemChain } from "viem";

/**
 * Wagmi compatible chain configuration
 */
export type Chain = {
	id: number;
	rpcUrls: {
		default: {
			http: string[];
		};
		[key: string]: {
			http: string[];
		};
	};
	nativeCurrency: {
		name: string;
		symbol: string;
		decimals: number;
	};
	name: string;
	blockExplorers?: {
		default: {
			name: string;
			url: string;
		};
		[key: string]: {
			name: string;
			url: string;
		};
	};
	testnet?: boolean;
};
