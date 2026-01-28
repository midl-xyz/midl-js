import { type Account, AddressType, type BitcoinNetwork } from "@midl/core";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import { publicKeyConvert } from "secp256k1";
import { getAddress, keccak256, toHex } from "viem";
import { getPublicKey } from "~/actions";

/**
 * Derives the EVM (Ethereum) address from a Bitcoin account and network.
 *
 * @param account - The Bitcoin account object.
 * @param network - The Bitcoin network.
 * @returns The corresponding EVM address as a string.
 */
export const getEVMAddress = (account: Account, network: BitcoinNetwork) => {
	let publicKey: `0x${string}` | null = null;

	switch (account.addressType) {
		case AddressType.P2TR: {
			publicKey = getPublicKey(account, network);
			break;
		}

		case AddressType.P2SH_P2WPKH:
		case AddressType.P2WPKH: {
			let pk = hexToBytes(account.publicKey);

			if (pk.length === 33) {
				pk = publicKeyConvert(pk, false);
			}

			publicKey = `0x${bytesToHex(pk.slice(1))}`;
			break;
		}
	}

	if (publicKey === null) {
		throw new Error("No public key found for account");
	}

	const publicKeyBuffer = hexToBytes(publicKey.slice(2));
	const address = hexToBytes(keccak256(publicKeyBuffer).slice(2)).slice(-20);

	return getAddress(toHex(address));
};
