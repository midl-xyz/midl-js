import { AddressPurpose } from "~/constants/index.js";
import type { BitcoinNetwork } from "~/createConfig.js";
import { isCorrectAddress } from "~/utils/isCorrectAddress.js";

export class AddressNetworkMismatch extends Error {
	constructor() {
		super();
		this.name = "AddressNetworkMismatch";
		this.message = "The address does not match the network configuration.";
	}
}

export const getAddressPurpose = (
	address: string,
	network: BitcoinNetwork,
): AddressPurpose => {
	if (!isCorrectAddress(address, network)) {
		throw new AddressNetworkMismatch();
	}

	switch (network.network) {
		case "bitcoin":
			if (address.startsWith("3")) {
				return AddressPurpose.Payment;
			}

			if (address.startsWith("bc1p")) {
				return AddressPurpose.Ordinals;
			}

			if (address.startsWith("bc1q")) {
				return AddressPurpose.Payment;
			}

			throw new Error("Unknown address type");

		case "testnet":
			if (address.startsWith("2")) {
				return AddressPurpose.Payment;
			}

			if (address.startsWith("tb1p")) {
				return AddressPurpose.Ordinals;
			}

			if (address.startsWith("tb1q")) {
				return AddressPurpose.Payment;
			}

			throw new Error("Unknown address type");

		case "regtest":
			if (address.startsWith("2")) {
				return AddressPurpose.Payment;
			}

			if (address.startsWith("bcrt1p")) {
				return AddressPurpose.Ordinals;
			}

			if (address.startsWith("bcrt1q")) {
				return AddressPurpose.Payment;
			}

			throw new Error("Unknown address type");
	}
};
