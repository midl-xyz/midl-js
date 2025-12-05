import type { Address } from "viem";
import { SystemContracts } from "~/config";
import type { TransactionIntention } from "~/types";

const isRequestAddAsset = (it: TransactionIntention) => {
	return (
		it.evmTransaction?.to === SystemContracts.Executor &&
		// keccak256("requestAddAsset(address,bytes32)")
		it.evmTransaction?.data?.startsWith("0xfae014d7")
	);
};

export const aggregateIntentionRunes = (
	intentions: TransactionIntention[],
	key: "withdraw" | "deposit",
) => {
	return Array.from(
		intentions
			.flatMap(
				(it) =>
					(typeof it[key] === "object" &&
						it[key]?.runes?.map((rune) => ({
							...rune,
							isRequestAddAsset: isRequestAddAsset(it),
						}))) ||
					[],
			)
			.reduce(
				(acc, rune) => {
					acc.set(rune.id, {
						id: rune.id,
						value: acc.get(rune.id)
							? // biome-ignore lint/style/noNonNullAssertion: <explanation>
								acc.get(rune.id)!.value + rune.amount
							: rune.amount,
						address: rune.address,
						isRequestAddAsset: rune.isRequestAddAsset,
					});

					return acc;
				},
				new Map<
					string,
					{
						id: string;
						value: bigint;
						address?: Address;
						isRequestAddAsset?: boolean;
					}
				>(),
			)
			.values(),
	);
};
