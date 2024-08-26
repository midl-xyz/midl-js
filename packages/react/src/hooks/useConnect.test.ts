import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useConnect } from "~/hooks/useConnect";
import { AddressPurpose } from "@midl-xyz/midl-js-core";
import { wrapper } from "~/__tests__/wrapper";

describe("useConnect", () => {
  it("returns the correct values", () => {
    const { result } = renderHook(
      () =>
        useConnect({
          purposes: [AddressPurpose.Ordinals],
        }),
      { wrapper }
    );

    expect("connect" in result.current).toBeTruthy();
    expect("connectAsync" in result.current).toBeTruthy();
    expect("connectors" in result.current).toBeTruthy();
  });
});
