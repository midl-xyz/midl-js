import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { wrapper } from "~/__tests__/wrapper";
import { useSignMessage } from "~/hooks/useSignMessage";

describe("useSignMessage", () => {
  it("returns the correct values", () => {
    const { result } = renderHook(() => useSignMessage(), { wrapper });

    expect("signMessage" in result.current).toBeTruthy();
    expect("signMessageAsync" in result.current).toBeTruthy();
    expect("isPending" in result.current).toBeTruthy();
  });
});
