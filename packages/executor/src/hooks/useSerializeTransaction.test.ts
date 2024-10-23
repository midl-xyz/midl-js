import { renderHook } from "@testing-library/react";
import { parseTransaction } from "viem";
import { describe, expect, it } from "vitest";
import { wrapper } from "~/__tests__";
import { useSerializeTransaction } from "~/hooks/useSerializeTransaction";

describe("executor | hooks | useSerializeTransaction", () => {
  it("should serialize a transaction", async () => {
    const { result } = renderHook(
      () => {
        return useSerializeTransaction();
      },
      { wrapper }
    );

    expect(
      await result.current?.({
        to: "0x3e80F8053eeF548C7062684A68177105e82439AA",
        value: 1n,
        btcTxHash: "0x123",
        chainId: 1,
      })
    ).toBe(
      "0x07df01808080943e80f8053eef548c7062684a68177105e82439aa0180820123c0"
    );
  });

  // TODO: finish test for incrementing nonce
  it.skip("should serialize a transaction with nonce increment", async () => {
    const { result } = renderHook(
      () => {
        return useSerializeTransaction({ shouldIncrementNonce: true });
      },
      { wrapper }
    );

    const tx = await result.current?.({
      to: "0x3e80F8053eeF548C7062684A68177105e82439AA",
      value: 1n,
      btcTxHash: "0x123",
      chainId: 1,
    });

    const tx2 = await result.current?.({
      to: "0x3e80F8053eeF548C7062684A68177105e82439AA",
      value: 1n,
      btcTxHash: "0x123",
      chainId: 1,
    });


    expect(parseTransaction(tx2).nonce).toBe(1);
  });
});
