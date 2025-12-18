export const ceilDiv = (a: bigint, b: bigint): bigint => {
	return (a + b - 1n) / b;
};
