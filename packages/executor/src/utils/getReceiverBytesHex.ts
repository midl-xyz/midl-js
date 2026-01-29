import { type Account, AddressType, type BitcoinNetwork } from "@midl/core";
import { hexToBytes } from "@noble/hashes/utils.js";
import * as bitcoin from "bitcoinjs-lib";
import { padBytes, toHex } from "viem";
import { getPublicKey } from "~/actions";

export const getReceiverBytesHex = (
	account: Account,
	network: BitcoinNetwork,
) => {
	switch (account.addressType) {
		case AddressType.P2TR: {
			return getPublicKey(account, network) as `0x${string}`;
		}

		case AddressType.P2SH_P2WPKH: {
			const p2wpkh = bitcoin.payments.p2wpkh({
				pubkey: hexToBytes(account.publicKey),
				network: bitcoin.networks[network.network],
			});
			const p2sh = bitcoin.payments.p2sh({
				redeem: p2wpkh,
				network: bitcoin.networks[network.network],
			});

			return toHex(
				// biome-ignore lint/style/noNonNullAssertion: P2SH output is guaranteed to be defined
				padBytes(p2sh.output!, {
					size: 32,
				}),
			);
		}

		case AddressType.P2WPKH: {
			const p2wpkh = bitcoin.payments.p2wpkh({
				address: account.address,
				network: bitcoin.networks[network.network],
			});

			return toHex(
				// biome-ignore lint/style/noNonNullAssertion: P2WPKH output is guaranteed to be defined
				padBytes(p2wpkh.output!, {
					size: 32,
				}),
			);
		}
	}
};
