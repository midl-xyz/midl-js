import { http, HttpResponse, type RequestHandler } from "msw";
import { setupServer } from "msw/node";
import type { RuneUTXO, UTXO } from "~/actions";
import { randomBytes } from "node:crypto";

const handlers: RequestHandler[] = [
	http.get("https://regtest-mempool.midl.xyz/api/v1/fees/recommended", () => {
		return HttpResponse.json({
			fastestFee: 1,
			halfHourFee: 1,
			hourFee: 1,
			economyFee: 1,
			minimumFee: 1,
		});
	}),
	http.get("https://regtest-mempool.midl.xyz/api/address/:address/utxo", () => {
		const utxos: UTXO[] = [
			{
				txid: randomBytes(32).toString("hex"),
				vout: 0,
				value: 100000000,
				status: {
					confirmed: true,
					block_height: 0,
					block_hash: "block_hash",
					block_time: 0,
				},
			},
		];

		return HttpResponse.json(utxos);
	}),
	http.get("https://regtest-mempool.midl.xyz/utxos/:address", ({ request }) => {
		const url = new URL(request.url);

		const runeUTXOS: RuneUTXO[] = [
			{
				height: 0,
				txid: randomBytes(32).toString("hex"),
				vout: 0,
				address: "address",
				satoshis: 546,
				scriptPk: "scriptPk",
				runes: [
					{
						runeId: url.searchParams.get("runeId") || "",
						rune: "MOCK",
						spacedRune: "MOCK",
						symbol: "M",
						divisibility: 0,
						amount: "100000000",
					},
				],
			},
		];

		return HttpResponse.json(runeUTXOS);
	}),
];

export const mockServer = setupServer(...handlers);
