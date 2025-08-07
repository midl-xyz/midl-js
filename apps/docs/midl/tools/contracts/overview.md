---
order: 0
title: "Overview"
---

# Overview

`@midl-xyz/hardhat-deploy` provides tools and utilities for deploying and interacting with smart contracts in a hybrid environment using Hardhat and MIDL.js. 

In general the process of writing and deploying contracts is similar to the standard Hardhat workflow, but with some MIDL-specific features and configurations.

`@midl-xyz/hardhat-deploy` relies on [`hardhat-deploy`](https://github.com/wighawag/hardhat-deploy) plugin to manage deployments execution order, however it uses its own deployment artifacts format to store MIDL-specific data.


## Installation

::: code-group 
```bash [pnpm]
pnpm add @midl-xyz/hardhat-deploy hardhat-deploy
```

```bash [npm]
npm install @midl-xyz/hardhat-deploy hardhat-deploy
```

```bash [yarn]
yarn add @midl-xyz/hardhat-deploy hardhat-deploy
```
:::


## Usage

In your Hardhat configuration file (`hardhat.config.ts`), you can set up the MIDL environment and extend your configuration with MIDL-specific settings:


## Configuration

In your Hardhat configuration file (`hardhat.config.ts`), you can set up the MIDL environment and extend your configuration with the following settings.

::: tip
For more details on the configuration options, see the [Configuration Reference](./config.md).
:::


```ts
import "hardhat-deploy";
import "@midl-xyz/hardhat-deploy";
import { midlRegtest } from "@midl-xyz/midl-js-executor";
import { type HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-verify";

export default (<HardhatUserConfig>{
	solidity: "0.8.28",
	defaultNetwork: "regtest",
	midl: {
		networks: {
			regtest: {
				mnemonic: vars.get("MNEMONIC"),
				path: "deployments",
				confirmationsRequired: 1,
				btcConfirmationsRequired: 1,
				hardhatNetwork: "regtest",
				network: {
					explorerUrl: "https://mempool.regtest.midl.xyz",
					id: "regtest",
					network: "regtest",
				},
			},
		},
	},
	networks: {
		regtest: {
			url: midlRegtest.rpcUrls.default.http[0],
			chainId: midlRegtest.id,
		},
	},
	etherscan: {
		apiKey: {
			regtest: "empty",
		},
		customChains: [
			{
				network: "regtest",
				chainId: midlRegtest.id,
				urls: {
					apiURL: "https://blockscout.regtest.midl.xyz/api",
					browserURL: "https://blockscout.regtest.midl.xyz",
				},
			},
		],
	},
});
```

## Usage

Create a new deployment script in the `deploy` directory (e.g., `deploy/01_deploy_contracts.ts`) and use the provided methods to deploy and interact with contracts.


```ts
import type { HardhatRuntimeEnvironment } from "hardhat/types";

export default async function deploy(hre: HardhatRuntimeEnvironment) {
  await hre.midl.initialize();

  // Deploy a contract
  await hre.midl.deploy('MyContract', { args: ["Hello, MIDL!"] });

  // Call a contract method
  await hre.midl.callContract('MyContract', 'setGreeting', { args: ["Hi!"] });

  // Execute all intentions (send transactions)
  await hre.midl.execute();
}
```

See the [Advanced Usage](./advanced-usage.md) for more examples on commonly used functionality.

