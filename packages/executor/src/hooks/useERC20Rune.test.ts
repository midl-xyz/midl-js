import { describe, expect, it } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useERC20Rune } from "~/hooks/useERC20Rune";
import { wrapper } from "~/__tests__";
import { zeroAddress } from "viem";

describe("useERC20Rune", () => {
  it.skip("should return the correct value", async () => {
    const { result } = renderHook(() => useERC20Rune("2582642:2"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.state.isSuccess).toBe(true));

    expect(result.current.rune?.name).toBe("AXQELDWPTBN");

    await waitFor(() => expect(result.current.erc20State.isSuccess).toBe(true));

    expect(result.current.erc20Address).toBe(zeroAddress);
  });
});
