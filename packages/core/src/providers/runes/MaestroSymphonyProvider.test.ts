import type { ClientOptions } from "openapi-fetch";
import { describe, expect, it, vi } from "vitest";
import { regtest } from "~/networks";
import { MaestroSymphonyProvider } from "~/providers/runes/MaestroSymphonyProvider";

const fetchMock = vi.fn();

vi.mock("openapi-fetch", async (importActual) => {
	const actual = await importActual<typeof import("openapi-fetch")>();

	return {
		...actual,
		default: (options: ClientOptions) =>
			actual.default({
				...options,
				fetch: fetchMock,
			}),
	};
});

describe("MaestroSymphonyProvider", () => {
	it("calls getRunes with include_info parameter", async () => {
		const ms = new MaestroSymphonyProvider();

		fetchMock.mockResolvedValueOnce({
			ok: true,
			headers: new Headers({ "Content-Type": "application/json" }),
			json: async () => ({
				data: [],
			}),
		} as Response);

		await ms.getRunes(regtest, "address");

		const req = new Request(
			"https://runes.staging.midl.xyz/addresses/address/runes/balances?include_info=true",
		);

		expect(fetchMock).toHaveBeenCalledWith(
			expect.objectContaining({
				url: req.url,
			}),
			undefined,
		);
	});
});
