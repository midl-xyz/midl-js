import {
	type Account,
	AddressType,
	getAddressType,
} from "@midl-xyz/midl-js-core";

export const getBTCAddressByte = (account: Account): bigint => {
	const addressType = getAddressType(account.address);

	switch (addressType) {
		case AddressType.P2SH_P2WPKH: {
			const pkFirstByte = Uint8Array.prototype.slice.call(
				Buffer.from(account.publicKey, "hex"),
				0,
				1,
			);

			return BigInt(pkFirstByte[0]) + 2n;
		}

		case AddressType.P2WPKH: {
			const pkFirstByte = Uint8Array.prototype.slice.call(
				Buffer.from(account.publicKey, "hex"),
				0,
				1,
			);

			return BigInt(pkFirstByte[0]);
		}

		default:
			return 0n;
	}
};
