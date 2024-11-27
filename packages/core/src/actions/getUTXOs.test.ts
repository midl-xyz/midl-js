import * as bitcoin from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import * as ecc from "tiny-secp256k1";
import {
	afterEach,
	assert,
	beforeEach,
	describe,
	expect,
	it,
	vi,
	type Mock,
} from "vitest";
import { getUTXOs } from "~/actions/getUTXOs";
import { createConfig } from "~/createConfig";
import { regtest } from "~/networks";

const ECPair = ECPairFactory(ecc);

describe("core | actions | getUTXOs", () => {
	const k = ECPair.fromWIF(
		"cTLkbV5v1iyM3WqknFHHmhBk6PTbpe778zWC12PEaEJzjbmW8onN",
		bitcoin.networks.testnet,
	);

	const keyPair = ECPair.makeRandom();

	const { address } = bitcoin.payments.p2pkh({
		pubkey: keyPair.publicKey,
		network: bitcoin.networks.regtest,
	});

	assert(address);

	beforeEach(() => {
		global.fetch = vi.fn();
	});

	afterEach(() => {
		(global.fetch as Mock).mockReset();
	});

	// TODO: Fix this test
	it.skip("should get UTXOs", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [],
		});

		(global.fetch as Mock).mockResolvedValue({
			json: async () => [
				{
					txid: "txid",
					vout: 0,
					value: 100000000,
					address,
					scriptPubKey: "scriptPubKey",
					blockHeight: 0,
					confirmations: 0,
				},
			],
		});

		const result = await getUTXOs(config, address);

		expect(global.fetch).toHaveBeenCalledWith(
			`${regtest.rpcUrl}/address/${address}/utxo`,
		);

		expect(result).toBeInstanceOf(Array);
	});
});
