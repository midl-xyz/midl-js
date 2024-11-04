import { extractXCoordinate } from "@midl-xyz/midl-js-core";
import { useAccounts, useMidlContext } from "@midl-xyz/midl-js-react";
import { networks, payments } from "bitcoinjs-lib";
import { toHex } from "viem";
import type { Address } from "viem/accounts";

type UseP2TRPublicKeyParams = {
	publicKey?: `0x${string}`;
};

export const useP2TRPublicKey = ({
	publicKey,
}: UseP2TRPublicKeyParams = {}) => {
	const { ordinalsAccount } = useAccounts();
	const { config } = useMidlContext();

	try {
		const pk = publicKey ?? ordinalsAccount?.publicKey;

		if (!pk || !config.network) {
			return null;
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
