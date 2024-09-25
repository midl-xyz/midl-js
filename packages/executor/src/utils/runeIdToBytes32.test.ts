import { describe, expect, it } from "vitest";
import { runeIdToBytes32 } from "~/utils";

describe("runeIdToBytes32", () => {
  it("should return the correct value", () => {
    const runeId = "2900622:601";
    const bytes32RuneId =
      "0x000000000000000000000000000000000000000000000000002c428e00000259";

    expect(runeIdToBytes32(runeId)).toBe(bytes32RuneId);
  });
});
