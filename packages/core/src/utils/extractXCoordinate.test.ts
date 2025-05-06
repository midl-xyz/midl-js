import { randomBytes } from "node:crypto";
import { describe, expect, it } from "vitest";
import { extractXCoordinate } from "~/utils/extractXCoordinate";

describe("core | utils | extractXCoordinate", () => {
	it("extracts correct bytes 33 byte pk", () => {
		const random = randomBytes(32);
		const pk = Buffer.concat([Buffer.alloc(1), random]).toString("hex");

		expect(extractXCoordinate(pk)).toBe(random.toString("hex"));
	});

	it("extracts correct bytes 65 byte pk", () => {
		const random = randomBytes(32);
		const pk = Buffer.concat([
			Buffer.alloc(1),
			random,
			Buffer.alloc(32),
		]).toString("hex");

		expect(extractXCoordinate(pk)).toBe(random.toString("hex"));
	});

	it("returns the same public key if 32 byte", () => {
		const random = randomBytes(32).toString("hex");

		expect(extractXCoordinate(random)).toBe(random);
	});

	it("throws error if public key is incorrect", () => {
		expect(() => extractXCoordinate(randomBytes(67).toString("hex"))).toThrow(
			"Invalid public key length",
		);
	});
});
