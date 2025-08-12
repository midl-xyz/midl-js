import type { TransactionIntention } from "~/types";

export const aggregateIntentionRunes = (
	intentions: TransactionIntention[],
	key: "withdraw" | "deposit",
) => {
	return Array.from(
		intentions
			.flatMap((it) => (typeof it[key] === "object" && it[key]?.runes) || [])
			.reduce(
				(acc, rune) => {
					acc.set(rune.id, {
						id: rune.id,
						value: acc.get(rune.id)
							? // biome-ignore lint/style/noNonNullAssertion: <explanation>
								acc.get(rune.id)!.value + rune.amount
							: rune.amount,
					});

					return acc;
				},
				new Map<
					string,
					{
						id: string;
						value: bigint;
					}
				>(),
			)
			.values(),
	);
};
