import { vi } from "vitest";
import type { AbstractProvider } from "~/providers";

export const mockProvider = {
	broadcastTransaction: vi.fn(),
	getUTXOs: vi.fn(),
	getLatestBlockHeight: vi.fn(),
	getFeeRate: vi.fn(),
	getTransactionStatus: vi.fn(),
	getTransactionHex: vi.fn(),
} satisfies AbstractProvider;
