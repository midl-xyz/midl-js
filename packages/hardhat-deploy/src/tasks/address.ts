import { task, types } from "hardhat/config";

task<{ index: number }>(
	"midl:address",
	"Get the Bitcoin and EVM address for a given account index",
	async (args, hre) => {
		await hre.midl.initialize(args.index);
		const { address, addressType } = hre.midl.getAccount();
		const evmAddress = hre.midl.getEVMAddress();

		console.log(
			`Bitcoin Address: ${address} (${addressType})\nEVM Address: ${evmAddress}`,
		);
	},
).addPositionalParam(
	"index",
	"The index of the account to get the address for",
	0,
	types.int,
	true,
);
