import { none, some } from "runelib";

export const encodeRuneSymbol = (symbol?: string) => {
	const codePoint = symbol?.codePointAt(0);

	if (typeof codePoint === "undefined") {
		return none();
	}

	return some(String.fromCodePoint(codePoint));
};
