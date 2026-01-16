import { getDefaultAccount } from "@midl/core";
import { getEVMAddress } from "@midl/executor";
import { task, types } from "hardhat/config";

task<{ index: number }>(
	"midl:address",
	"Get the Bitcoin and EVM address for a given account index",
	async (args, hre) => {
		const config = await hre.midl.initialize(args.index);
		const account = getDefaultAccount(config);
		const evmAddress = getEVMAddress(account, config.getState().network);

		console.log(
			`Bitcoin Address: ${account.address} (${account.addressType})\nEVM Address: ${evmAddress}`,
		);
	},
).addPositionalParam(
	"index",
	"The index of the account to get the address for",
	0,
	types.int,
	true,
);
