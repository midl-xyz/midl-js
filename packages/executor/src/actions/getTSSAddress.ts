import type { Config } from "@midl/core";
import * as bitcoin from "bitcoinjs-lib";
import type { PublicClient, WalletClient } from "viem";
import { readContract } from "viem/actions";
import { SystemContracts } from "~/config";
import { globalParamsAbi } from "~/contracts";

export const getTSSAddress = async (
	config: Config,
	client: PublicClient | WalletClient,
) => {
	const { network } = config.getState();

	if (!network) {
		throw new Error("Network not set");
	}

	const data = await readContract(client, {
		address: SystemContracts.GlobalParams,
		abi: globalParamsAbi,
		functionName: "getTSSAddress",
	});

	const scriptPubKey = bitcoin.script.compile([
		bitcoin.opcodes.OP_1,
		Buffer.from(data.slice(2), "hex"),
	]);

	return bitcoin.address.fromOutputScript(
		scriptPubKey,
		bitcoin.networks[network.network],
	);
};
