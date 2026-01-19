import { type Mock, afterEach, describe, expect, it, vi } from "vitest";
import { mainnet, testnet } from "~/networks";
import { MaestroProvider } from "~/providers/MaestroProvider";

const mockFetch: Mock<typeof fetch> = vi.fn();

vi.mock("openapi-fetch", async (importActual) => {
	const actual = await importActual<typeof import("openapi-fetch")>();
	return {
		default: (...params: Parameters<typeof actual.default>) => {
			return actual.default({
				...params,
				fetch: mockFetch,
			});
		},
	};
});

describe("core | providers | MaestroProvider", () => {
	afterEach(() => {
		mockFetch.mockReset();
	});

	it("throws error if response not ok", async () => {
		const apiKey = "invalid-api-key";

		const provider = new MaestroProvider(apiKey);

		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 401,
			statusText: "Unauthorized",
			clone: () => ({
				ok: false,
				status: 401,
				statusText: "Unauthorized",
				headers: new Headers({ "Content-Type": "application/json" }),
				json: async () => ({
					message: "Invalid API key",
				}),
			}),
		} as Response);

		await expect(provider.getUTXOs(mainnet, "some-address")).rejects.toThrow(
			"Maestro API error: 401 Invalid API key",
		);

		const [req] = (mockFetch.mock.lastCall ?? []) as [Request];

		expect(req.headers.get("api-key")).toBe(apiKey);
	});

	it("gets utxos by address", async () => {
		const apiKey = "test-api-key";
		const provider = new MaestroProvider(apiKey);

		mockFetch.mockResolvedValueOnce({
			ok: true,
			headers: new Headers({ "Content-Type": "application/json" }),
			json: async () => ({
				data: [
					{
						txid: "some-txid",
					},
				],
			}),
		} as Response);

		const utxos = await provider.getUTXOs(mainnet, "some-address");
		const [req] = (mockFetch.mock.lastCall ?? []) as [Request];

		expect(utxos).toEqual([
			expect.objectContaining({
				txid: "some-txid",
			}),
		]);
		expect(req.url).toBe(
			"https://xbt-mainnet.gomaestro-api.org/v0/addresses/some-address/utxos?exclude_metaprotocols=true",
		);
		expect(req.headers.get("api-key")).toBe(apiKey);
	});

	it("calls testnet URL when network is testnet", async () => {
		const apiKey = "test-api-key";
		const provider = new MaestroProvider(apiKey);

		mockFetch.mockResolvedValueOnce({
			ok: true,
			headers: new Headers({ "Content-Type": "application/json" }),
			json: async () => ({
				data: [],
			}),
		} as Response);

		await provider.getUTXOs(testnet, "some-address");
		const [req] = (mockFetch.mock.lastCall ?? []) as [Request];
		expect(req.url).toBe(
			"https://xbt-testnet.gomaestro-api.org/v0/addresses/some-address/utxos?exclude_metaprotocols=true",
		);
	});

	it("accepts custom RPC URLs", async () => {
		const apiKey = "test-api-key";
		const customRpcUrls = {
			mainnet: "https://custom-mainnet.gomaestro-api.org/v0",
		};
		const provider = new MaestroProvider(apiKey, customRpcUrls);

		mockFetch.mockResolvedValueOnce({
			ok: true,
			headers: new Headers({ "Content-Type": "application/json" }),
			json: async () => ({
				data: [],
			}),
		} as Response);

		await provider.getUTXOs(mainnet, "some-address");
		const [req] = (mockFetch.mock.lastCall ?? []) as [Request];
		expect(req.url).toBe(
			"https://custom-mainnet.gomaestro-api.org/v0/addresses/some-address/utxos?exclude_metaprotocols=true",
		);
	});
});
