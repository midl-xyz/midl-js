import { extractXCoordinate } from "@midl-xyz/midl-js-core";
import { useAccounts, useMidlContext } from "@midl-xyz/midl-js-react";
import { networks, payments } from "bitcoinjs-lib";
import { toHex } from "viem";

type usePublicKey = {
	publicKey?: `0x${string}`;
};

export const usePublicKey = ({ publicKey }: usePublicKey = {}) => {
	const { ordinalsAccount, paymentAccount } = useAccounts();
	const { config } = useMidlContext();

	try {
		const pk =
			publicKey ?? paymentAccount?.publicKey ?? ordinalsAccount?.publicKey;

		if (!pk || !config.network) {
			return null;
		}

		if (paymentAccount) {
			return toHex(Buffer.from(extractXCoordinate(pk), "hex"));
		}

		const p2tr = payments.p2tr({
			internalPubkey: Buffer.from(extractXCoordinate(pk), "hex"),
			network: networks[config.network.network],
		});
		// biome-ignore lint/style/noNonNullAssertion: Output is guaranteed to be defined
		return toHex(p2tr.output!.slice(2));
	} catch (e) {
		return null;
	}
};
