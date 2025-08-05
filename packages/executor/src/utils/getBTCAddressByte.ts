import {
	type Account,
	AddressType,
	getAddressType,
} from "@midl-xyz/midl-js-core";

/**
 * Returns a byte value derived from the public key of a Bitcoin account, depending on its address type.
 *
 * For P2SH_P2WPKH addresses, adds 2 to the first byte of the public key.
 * For P2WPKH addresses, returns the first byte of the public key.
 * For other address types, returns 0n.
 *
 * @param account - Account.
 * @returns The derived byte value as a bigint.
 */
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
