require("../../../dist/cjs/index");
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: "0.8.28",
	midl: {
		path: "deployments",
		networks: {
			default: {
				// network: "default",
				mnemonic:
					"face spike layer label health knee cry taste carpet found elegant october",
				confirmationsRequired: 1,
				btcConfirmationsRequired: 1,
			},
		},
	},
	// networks: {
	// 	default: {
	// 		url: "https://evm-rpc.regtest.midl.xyz",
	// 		chainId: 777,
	// 	},
	// },
};
