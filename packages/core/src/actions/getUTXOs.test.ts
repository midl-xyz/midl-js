import * as bitcoin from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import ecc from "@bitcoinerlab/secp256k1";
import {
	afterEach,
	assert,
	beforeAll,
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
import { mockServer } from "~/__tests__/mockServer";

const ECPair = ECPairFactory(ecc);

describe("core | actions | getUTXOs", () => {
	const keyPair = ECPair.makeRandom();

	const { address } = bitcoin.payments.p2pkh({
		pubkey: keyPair.publicKey,
		network: bitcoin.networks.regtest,
	});

	assert(address);

	beforeAll(() => {
		mockServer.listen();
	});

	it("should get UTXOs", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [],
		});

		const result = await getUTXOs(config, address);

		expect(result).toBeInstanceOf(Array);
	});
});
