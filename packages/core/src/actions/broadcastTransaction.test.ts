import {
	type Mock,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import { broadcastTransaction } from "~/actions/broadcastTransaction";
import { SatsConnectConnector } from "~/connectors/sats-connect";
import { createConfig } from "~/createConfig";
import { regtest } from "~/networks";

describe("core | actions | broadcastTransaction", () => {
	beforeEach(() => {
		global.fetch = vi.fn();
	});

	afterEach(() => {
		(global.fetch as Mock).mockReset();
	});

	// TODO: Fix this test
	it.skip("should broadcast a transaction", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [new SatsConnectConnector()],
		});

		(global.fetch as Mock).mockResolvedValue({
			text: async () => "txid",
		});

		broadcastTransaction(config, "txHex");

		expect(global.fetch).toHaveBeenCalledWith(`${regtest.rpcUrl}/tx`, {
			method: "POST",
			body: "txHex",
		});
	});
});
