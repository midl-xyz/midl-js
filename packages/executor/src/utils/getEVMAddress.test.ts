import { describe, expect, it } from "vitest";
import { getEVMAddress } from "~/utils/getEVMAddress";

describe("utils | getEVMAddress", () => {
  it("should return the EVM address", () => {
    const publicKey =
      "0x78a47b7db322fd484826f3056527df465d398fc29bb22a86907ef2e452c6ca6f";

    const expectedEVMAddress = "0x9901ab08ABb0e032604CeCa1D06ff4a947942048";

    expect(getEVMAddress(publicKey)).toBe(expectedEVMAddress);
  });
});
