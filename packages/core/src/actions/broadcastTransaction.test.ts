import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	type Mock,
	vi,
} from "vitest";
import { broadcastTransaction } from "~/actions/broadcastTransaction";
import { devnet } from "~/chains";
import { satsConnect } from "~/connectors";
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
			chain: devnet,
			connectors: [satsConnect()],
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
