import { describe, expect, it } from "vitest";
import { bytes32toRuneId } from "~/utils";

describe("bytes32toRuneId", () => {
  it("should return the correct value", () => {
    const runeId = "2900622:601";
    const bytes32RuneId =
      "0x000000000000000000000000000000000000000000000000002c428e00000259";

    expect(bytes32toRuneId(bytes32RuneId)).toBe(runeId);
  });
});
