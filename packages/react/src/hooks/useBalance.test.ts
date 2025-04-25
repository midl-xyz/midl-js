import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { wrapper } from "~/__tests__/wrapper";
import { useBalance } from "~/hooks/useBalance";

describe("useBalance", () => {
	it.skip("works", async () => {
		const { result } = renderHook(
			() =>
				useBalance({
					address:
						"bcrt1puwn2akldaf2hqv64kmkjt3lgutk4se8rlmr8rcpk2v0ygg6zqqtqzzjdq9",
				}),
			{
				wrapper,
			},
		);

		await waitFor(() => expect(result.current.isFetching).toBe(false));

		expect(result.current.isError).toBe(false);
		expect(result.current.balance).toBeGreaterThanOrEqual(0);
	});
});
