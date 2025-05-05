import { http, HttpResponse, type RequestHandler } from "msw";
import { setupServer } from "msw/node";
import { randomBytes } from "node:crypto";
import type { RuneUTXO, UTXO } from "~/providers";

const handlers: RequestHandler[] = [
	http.get("https://mempool.regtest.midl.xyz/api/v1/fees/recommended", () => {
		return HttpResponse.json({
			fastestFee: 1,
			halfHourFee: 1,
			hourFee: 1,
			economyFee: 1,
			minimumFee: 1,
		});
	}),

	http.post("https://mempool.regtest.midl.xyz/api/tx", () => {
		return HttpResponse.text(randomBytes(32).toString("hex"));
	}),

	http.get("https://mempool.regtest.midl.xyz/api/address/:address/utxo", () => {
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
	http.get("https://mempool.regtest.midl.xyz/utxos/:address", ({ request }) => {
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
						runeid: url.searchParams.get("runeId") || "",
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
	http.get("https://mempool.regtest.midl.xyz/api/tx/:txid/hex", () => {
		return HttpResponse.text(
			"02000000000101c0b2f3d4e5f6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0",
		);
	}),

	http.get("https://mempool.regtest.midl.xyz/api/tx/:txid/status", () => {
		return HttpResponse.json({
			confirmed: true,
			block_height: 0,
		});
	}),

	http.get("https://mempool.regtest.midl.xyz/api/blocks/tip/height", () => {
		return HttpResponse.text("0");
	}),
];

export const mockServer = setupServer(...handlers);
