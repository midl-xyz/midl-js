require("../../../dist/cjs/index");

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
};
