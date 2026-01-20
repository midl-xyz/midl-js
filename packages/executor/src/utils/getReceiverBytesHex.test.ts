import { AddressPurpose, AddressType, mainnet, regtest } from "@midl/core";

import { describe, expect, it } from "vitest";
import { getReceiverBytesHex } from "~/utils/getReceiverBytesHex";

describe("getReceiverBytesHex", () => {
	it("returns x coords for P2TR addresses", () => {
		const randomBytes = Buffer.from(
			"b4c0ffeeb4c0ffeeb4c0ffeeb4c0ffeeb4c0ffeeb4c0ffeeb4c0ffeeb4c0ffee",
			"hex",
		);

		const bytes = getReceiverBytesHex(
			{
				addressType: AddressType.P2TR,
				address: "p2tr-address",
				publicKey: randomBytes.toString("hex"),
				purpose: AddressPurpose.Ordinals,
			},
			regtest,
		);

		expect(bytes).toBe(
			"0x2aac84ec62c22974ed4b3bdc1c2b966d7feef50561376827d93fce6df232ccf8",
		);
	});

	it("returns padded scriptPubKey for P2SH_P2WPKH addresses", () => {
		const randomBytes = Buffer.from(
			"0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
			"hex",
		);

		const bytes = getReceiverBytesHex(
			{
				addressType: AddressType.P2SH_P2WPKH,
				address: "p2sh-p2wpkh-address",
				publicKey: randomBytes.toString("hex"),
				purpose: AddressPurpose.Payment,
			},
			regtest,
		);

		expect(bytes).toBe(
			"0x000000000000000000a914bcfeb728b584253d5f3f70bcb780e9ef218a68f487",
		);

		expect(Buffer.from(bytes.slice(2), "hex").length).toBe(32);
	});

	it("returns padded scriptPubKey for P2WPKH addresses", () => {
		const bytes = getReceiverBytesHex(
			{
				addressType: AddressType.P2WPKH,
				address: "bc1qhp80relrnr2kl2y2x4klxyullxt3zncyj9nd3c",
				publicKey:
					"03997651fec067eda2c430bfe548f65575737c9b892d8b529ae9dc0dfcb5c5898a",
				purpose: AddressPurpose.Payment,
			},
			mainnet,
		);

		expect(bytes).toBe(
			"0x000000000000000000000014b84ef1e7e398d56fa88a356df3139ff997114f04",
		);
	});
});
