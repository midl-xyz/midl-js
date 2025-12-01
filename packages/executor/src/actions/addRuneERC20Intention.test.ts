import { AddressPurpose, connect, disconnect } from "@midl/core";
import { http, createPublicClient } from "viem";
import {
	afterAll,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import { midlConfig } from "~/__tests__/midlConfig";
import { addRuneERC20Intention } from "~/actions/addRuneERC20Intention";
import { midlRegtest } from "~/config";

vi.mock("./getTSSAddress", async (importActual) => {
	const actual = await importActual<typeof import("./getTSSAddress")>();
	return {
		...actual,
		getTSSAddress: vi
			.fn()
			.mockResolvedValue(
				"bcrt1prdz97t7n4fqvrqzh3f3syknpjutcz8y23fmn47klhaaq95nl24fq57u8tq",
			),
	};
});

vi.mock("@midl/core", async (importOriginal) => ({
	...(await importOriginal<typeof import("@midl/core")>()),
	getBlockNumber: vi.fn().mockResolvedValue(100),
	getRune: vi.fn().mockImplementation((_, runeId) => {
		if (runeId === "JUSTETHCEDRUNE") {
			return {
				name: "JUSTETHCEDRUNE",
				location: { block_height: 95 },
			};
		}
		return {
			name: runeId,
			location: { block_height: 90 },
		};
	}),
}));

describe("executor | actions | addRune", () => {
	beforeEach(async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
		});
	});

	afterEach(async () => {
		await disconnect(midlConfig);
	});

	afterAll(() => {
		vi.restoreAllMocks();
	});

	it("throws error if confirmations is less than 6", async () => {
		await expect(() =>
			addRuneERC20Intention(midlConfig, "JUSTETHCEDRUNE"),
		).rejects.toThrow("Confirmations must be at least 6");
	});

	it("returns intention", async () => {
		const result = await addRuneERC20Intention(midlConfig, "RUNEWITHVALIDNAME");
		expect(result).toBeDefined();
		expect(result.evmTransaction).toBeDefined();
		expect(result.deposit).toEqual(
			expect.objectContaining({
				runes: [
					{
						id: "RUNEWITHVALIDNAME",
						amount: 1n,
					},
				],
			}),
		);
	});
});
