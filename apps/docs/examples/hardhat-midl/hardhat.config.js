require("hardhat-deploy");
require("@midl-xyz/hardhat-deploy");
const { vars } = require("hardhat/config");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: "0.8.28",
	midl: {
		path: "deployments",
		default: {
			mnemonic: vars.get("MNEMONIC"),
			confirmationsRequired: 1,
			btcConfirmationsRequired: 1,
		},
	},
};
