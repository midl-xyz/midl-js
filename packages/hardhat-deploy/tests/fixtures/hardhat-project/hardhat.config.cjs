const { MaestroSymphonyProvider, MempoolSpaceProvider } = require("@midl/core");

require("../../../dist/cjs/index");
require("hardhat-deploy");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const deploymentsDir = fs.mkdtempSync(
	path.join(os.tmpdir(), "midl-hardhat-deploy-"),
);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: "0.8.28",
	midl: {
		path: deploymentsDir,
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
