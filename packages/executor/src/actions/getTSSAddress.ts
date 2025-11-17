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

	const xOnly = Buffer.from(data.slice(2), "hex");

	const { address } = bitcoin.payments.p2tr({
		internalPubkey: xOnly,
		network: bitcoin.networks[network.network],
	});

	if (!address) {
		throw new Error("Failed to derive TSS address");
	}

	return address;
};
