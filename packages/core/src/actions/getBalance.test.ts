import { randomBytes } from "node:crypto";
import { keyPairConnector } from "@midl/node";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { makeRandomAddress } from "~/__tests__/makeRandomAddress";
import { disconnect } from "~/actions/disconnect";
import { getBalance } from "~/actions/getBalance";
import { createConfig } from "~/createConfig";
import { regtest } from "~/networks";
import type { UTXO } from "~/providers";

describe("core | actions | getBalance", () => {
	const config = createConfig({
		networks: [regtest],
		connectors: [
			keyPairConnector({
				mnemonic: "test test test test test test test test test test test junk",
			}),
		],
	});

	const mockServer = setupServer(
		...[
			http.get(
				"https://mempool.staging.midl.xyz/api/address/:address/utxo",
				() => {
					const utxos: UTXO[] = [
						{
							txid: randomBytes(32).toString("hex"),
							vout: 0,
							value: 100000000,
							status: {
								confirmed: true,
								block_height: 0,
							},
						},
						{
							txid: randomBytes(32).toString("hex"),
							vout: 0,
							value: 100000000,
							status: {
								confirmed: true,
								block_height: 0,
							},
						},
					];

					return HttpResponse.json(utxos);
				},
			),
		],
	);

	beforeAll(async () => {
		mockServer.listen();
	});

	afterAll(async () => {
		mockServer.close();

		await disconnect(config);
	});

	it("returns the correct balance", async () => {
		const balance = await getBalance(config, makeRandomAddress());

		expect(balance).toEqual(200000000);
	});
});
