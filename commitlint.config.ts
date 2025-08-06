import type { UserConfig } from "@commitlint/types";

const Configuration: UserConfig = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"scope-enum": [
			2,
			"always",
			[
				"hardhat-deploy",
				"docs",
				"core",
				"config",
				"executor",
				"executor-react",
				"react",
				"satoshi-kit",
				"rune-etcher",
				"node",
			],
		],
	},
};

export default Configuration;
