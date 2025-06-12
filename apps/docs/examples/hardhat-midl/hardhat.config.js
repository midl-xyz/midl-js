require("hardhat-deploy");
require("@midl-xyz/hardhat-deploy");
const { midlRegtest } = require("@midl-xyz/midl-js-executor");
const { vars } = require("hardhat/config");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: "0.8.28",
	midl: {
		mnemonic: vars.get("MNEMONIC"),
		path: "deployments",
		confirmationsRequired: 1,
		btcConfirmationsRequired: 1,
	},
};
