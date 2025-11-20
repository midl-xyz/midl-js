const { MaestroSymphonyProvider, MempoolSpaceProvider } = require("@midl/core");

require("../../../dist/cjs/index");
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: "0.8.28",
	midl: {
		path: "deployments",
		networks: {
			default: {
				mnemonic:
					"face spike layer label health knee cry taste carpet found elegant october",
				confirmationsRequired: 1,
				btcConfirmationsRequired: 1,
				hardhatNetwork: "default",
				network: {
					explorerUrl: "https://mempool.staging.midl.xyz",
					id: "regtest",
					network: "regtest",
				},
				runesProvider: new MaestroSymphonyProvider({
					regtest: "https://runes.staging.midl.xyz",
				}),
				provider: new MempoolSpaceProvider({
					regtest: "https://mempool.staging.midl.xyz",
				}),
			},
		},
	},
	networks: {
		default: {
			url: "https://rpc.staging.midl.xyz",
			chainId: 777,
		},
	},
};
