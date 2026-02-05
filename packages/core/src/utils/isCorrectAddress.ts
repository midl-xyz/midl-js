import type { BitcoinNetwork } from "~/createConfig.js";

export const isCorrectAddress = (address: string, network: BitcoinNetwork) => {
	switch (network.network) {
		case "bitcoin":
			return (
				address.startsWith("bc1") ||
				address.startsWith("1") ||
				address.startsWith("3")
			);
		case "testnet":
			return (
				address.startsWith("tb1") ||
				address.startsWith("m") ||
				address.startsWith("2")
			);
		case "regtest":
			return (
				address.startsWith("bcrt1") ||
				address.startsWith("m") ||
				address.startsWith("2")
			);
	}
};
