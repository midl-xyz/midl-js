import { randomBytes } from "node:crypto";
import { http, HttpResponse, ws } from "msw";
import { setupServer } from "msw/node";
import type { UTXO } from "~/providers";

const wsApi = ws.link("wss://mempool.regtest.midl.xyz/api/v1/ws");

const handlers = [
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
				txid: Buffer.alloc(32).toString("hex"),
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
	http.get("https://mempool.regtest.midl.xyz/utxos/:address", ({ request }) => {
		const url = new URL(request.url);

		// biome-ignore lint/suspicious/noExplicitAny: TODO: specify type
		const runeUTXOS: any[] = [
			{
				height: 0,
				txid: Buffer.alloc(32).toString("hex"),
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
			Buffer.concat([
				Buffer.from("01000000", "hex"), // version
				Buffer.from([0x01]), // input count
				Buffer.alloc(32), // txid
				Buffer.from("00000000", "hex"), // vout
				Buffer.from([0x00]), // scriptSig length
				Buffer.from("ffffffff", "hex"), // sequence
				Buffer.from([0x01]), // output count
				Buffer.from("00f2052a01000000", "hex"), // value (0.01 BTC)
				Buffer.from([0x00]), // scriptPubKey length
				Buffer.from("00000000", "hex"), // locktime
			]).toString("hex"),
		);
	}),

	http.get("https://mempool.regtest.midl.xyz/api/tx/:txid/status", () => {
		return HttpResponse.json({
			confirmed: true,
			block_height: 0,
		});
	}),

	http.get("https://mempool.regtest.midl.xyz/api/blocks/tip/height", () => {
		return HttpResponse.text("101");
	}),
	wsApi.addEventListener("connection", ({ server, client }) => {
		server.connect();

		client.addEventListener("message", (event) => {
			event.preventDefault();
			const data = JSON.parse(event.data.toString());

			client.send(
				JSON.stringify({
					txPosition: {
						txid: Array.isArray(data["track-tx"])
							? data["track-tx"]
							: [data["track-tx"]],
						position: {
							block: 100,
							vsize: 250,
						},
					},
				}),
			);
		});
	}),
];

export const mockServer = setupServer(...handlers);
