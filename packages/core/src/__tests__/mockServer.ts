import { randomBytes } from "node:crypto";
import { bytesToHex, concatBytes, hexToBytes } from "@noble/hashes/utils.js";
import { http, HttpResponse, ws } from "msw";
import { setupServer } from "msw/node";
import type { UTXO } from "~/providers";

const wsApi = ws.link("wss://mempool.staging.midl.xyz/api/v1/ws");

const handlers = [
	http.get("https://mempool.staging.midl.xyz/api/v1/fees/recommended", () => {
		return HttpResponse.json({
			fastestFee: 1,
			halfHourFee: 1,
			hourFee: 1,
			economyFee: 1,
			minimumFee: 1,
		});
	}),

	http.post("https://mempool.staging.midl.xyz/api/tx", () => {
		return HttpResponse.text(randomBytes(32).toString("hex"));
	}),

	http.get("https://mempool.staging.midl.xyz/api/address/:address/utxo", () => {
		const utxos: UTXO[] = [
			{
				txid: bytesToHex(new Uint8Array(32)),
				vout: 0,
				value: 100000000,
				status: {
					confirmed: true,
					block_height: 0,
				},
			},
		];

		return HttpResponse.json(utxos);
	}),
	http.get("https://mempool.staging.midl.xyz/utxos/:address", ({ request }) => {
		const url = new URL(request.url);

		// biome-ignore lint/suspicious/noExplicitAny: TODO: specify type
		const runeUTXOS: any[] = [
			{
				height: 0,
				txid: bytesToHex(new Uint8Array(32)),
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
	http.get("https://mempool.staging.midl.xyz/api/tx/:txid/hex", () => {
		return HttpResponse.text(
			bytesToHex(
				concatBytes(
					Uint8Array.from([0x01, 0x00, 0x00, 0x00]), // version
					Uint8Array.from([0x01]), // input count
					new Uint8Array(32), // txid
					Uint8Array.from([0x00, 0x00, 0x00, 0x00]), // vout
					Uint8Array.from([0x00]), // scriptSig length
					Uint8Array.from([0xff, 0xff, 0xff, 0xff]), // sequence
					Uint8Array.from([0x01]), // output count
					Uint8Array.from([0x00, 0xf2, 0x05, 0x2a, 0x01, 0x00, 0x00, 0x00]), // value (0.01 BTC)
					Uint8Array.from([0x00]), // scriptPubKey length
					Uint8Array.from([0x00, 0x00, 0x00, 0x00]), // locktime
				),
			),
		);
	}),

	http.get("https://mempool.staging.midl.xyz/api/tx/:txid/status", () => {
		return HttpResponse.json({
			confirmed: true,
			block_height: 0,
		});
	}),

	http.get("https://mempool.staging.midl.xyz/api/blocks/tip/height", () => {
		return HttpResponse.text("100");
	}),
	wsApi.addEventListener("connection", ({ server, client }) => {
		server.connect();

		client.addEventListener("message", (event) => {
			event.preventDefault();
			const data = JSON.parse(event.data.toString());

			// Handle track-tx subscription
			if (data["track-tx"]) {
				client.send(JSON.stringify({ txConfirmed: data["track-tx"] }));
				return;
			}

			// Handle blocks subscription
			if (data.action !== undefined && data.data.includes("blocks")) {
				client.send(
					JSON.stringify({
						block: {
							height: 120,
						},
					}),
				);
			}
		});
	}),
];

export const mockServer = setupServer(...handlers);
