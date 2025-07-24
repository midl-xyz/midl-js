import { http, HttpResponse, type RequestHandler } from "msw";
import { setupServer } from "msw/node";
import { toHex } from "viem";

const handlers: RequestHandler[] = [
	http.post("https://rpc-dev.midl.xyz", async ({ request }) => {
		const body = (await request.json()) as {
			jsonrpc: string;
			id: number;
			method: string;
			params: string[];
		};

		if (
			body.method === "eth_getBalance" ||
			body.method === "eth_getTransactionCount"
		) {
			return HttpResponse.json({
				jsonrpc: "2.0",
				id: body.id,
				result: "0x0", // Return 0 balance or transaction count
			});
		}

		if (body.method === "eth_call") {
			return HttpResponse.json({
				jsonrpc: "2.0",
				id: body.id,
				result: toHex(0n, { size: 32 }), // Return 0 for eth_call
			});
		}

		throw new Error(`Unhandled method: ${body.method}`);
	}),
];

export const mockServer = setupServer(...handlers);
