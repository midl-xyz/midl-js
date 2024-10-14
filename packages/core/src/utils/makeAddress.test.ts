import { describe, expect, it } from "vitest";
import { AddressPurpose } from "~/constants";
import { testnet } from "~/networks";
import { makeAddress } from "~/utils/makeAddress";

describe("core | utils | makeAddress", () => {
  it("should make an Payment address", async () => {
    const publicKey =
      "032b9f2d2c99278ddc7e682b1a663cd32a313228890efe26529574ce579b139cad";
    const purpose = AddressPurpose.Payment;

    const address = await makeAddress(publicKey, purpose, testnet);

    expect(address).toBe("2N4KqvB66ZvKsEqAMaZVNmzEmPxk2BNAhAr");
  });

  it("should make an Ordinals address", async () => {
    const publicKey =
      "0366be793017fade0d3b9965ebfc8e0ddc87eb4ad4330995298193fea996dd0c8f";

    const purpose = AddressPurpose.Ordinals;

    const address = await makeAddress(publicKey, purpose, testnet);

    expect(address).toBe(
      "tb1p0zj8kldnyt75sjpx7vzk2f7lgewnnr7znwez4p5s0mewg5kxefhstevkt0"
    );
  });
});
