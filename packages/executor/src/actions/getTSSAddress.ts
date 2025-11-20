import type { Config } from "@midl/core";
import * as bitcoin from "bitcoinjs-lib";
import type { Client } from "viem";
import { readContract } from "viem/actions";
import { SystemContracts } from "~/config";
import { globalParamsAbi } from "~/contracts";

export const getTSSAddress = async (config: Config, client: Client) => {
	const { network } = config.getState();

	if (!network) {
		throw new Error("Network not set");
	}

	const data = await readContract(client, {
		address: SystemContracts.GlobalParams,
		abi: globalParamsAbi,
		functionName: "getTSSAddress",
	});

	const p2trScriptPubKey = Buffer.from(`5120${data.slice(2)}`, "hex");
	const witnessVersion = p2trScriptPubKey[0] - 0x50;
	const witnessProgram = p2trScriptPubKey.slice(2);

	return bitcoin.address.toBech32(
		witnessProgram,
		witnessVersion,
		bitcoin.networks[network.network].bech32,
	);
};
