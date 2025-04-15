require("../../../dist/cjs/index");
require("@nomicfoundation/hardhat-verify");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: "0.8.28",
	midl: {
		mnemonic:
			"face spike layer label health knee cry taste carpet found elegant october",
		path: "deployments",
		confirmationsRequired: 1,
		btcConfirmationsRequired: 1,
	},
	networks: {
		default: {
			url: "https://evm-rpc.regtest.midl.xyz",
			chainId: 777,
		},
	},
	sourcify: {
		enabled: false,
	},
	etherscan: {
		apiKey: {
			default: "empty",
		},
		customChains: [
			{
				network: "default",
				chainId: 777,
				urls: {
					apiURL: "https://blockscout.regtest.midl.xyz:443/api",
					browserURL: "https://blockscout.regtest.midl.xyz:443",
				},
			},
		],
	},
};
