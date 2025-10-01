import { vi } from "vitest";
import type { AbstractRunesProvider } from "~/providers";

export const mockRuneProvider = {
	getRune: vi.fn(),
	getRuneBalance: vi.fn(),
	getRunes: vi.fn(),
	getRuneUTXOs: vi.fn(),
} satisfies AbstractRunesProvider;
