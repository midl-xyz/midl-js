# Deploy Contract

The process of deploying a contract to MIDL is similar to deploying on EVM-compatible networks, with the key difference that every deployment and write transaction requires interaction with Bitcoin L1. For the best experience, we recommend using the `@midl/hardhat-deploy` plugin together with [hardhat-deploy](https://github.com/wighawag/hardhat-deploy).

You can find advanced examples in [this repo](https://github.com/midl-xyz/smart-contract-deploy-starter).

## Overview

In this guide, you will deploy a simple Solidity smart contract to the MIDL network. The example contract is a basic storage contract that allows you to store and retrieve a value on-chain. This demonstrates the core workflow for deploying and interacting with contracts on MIDL.

The steps covered in this guide are:

- **Project Setup:** Initialize a new Hardhat project and install the required dependencies for MIDL.
- **Configuration:** Configure Hardhat and the MIDL deploy plugin for your environment.
- **Write the Contract:** Create a simple storage contract in Solidity.
- **Deployment Script:** Write a script to deploy your contract using the MIDL Hardhat plugin.
- **Deploy the Contract:** Run the deployment, which will require confirmation on Bitcoin Layer 1.
- **Verify:** Verify your contract on the block explorer after deployment.




## Create a New Project

First, create a new project using the following commands:

```bash
mkdir hardhat-midl
cd hardhat-midl
pnpm init
pnpm add -D hardhat @midl/hardhat-deploy hardhat-deploy @midl/executor
```

::: warning
We support Hardhat up to version `2.28.3` (latest 2.x).
:::

## Initialize Hardhat

Run the following command to initialize Hardhat:

```bash
pnpx hardhat init
```

Choose `Create a TypeScript project`:

```bash
? What do you want to do? …
  Create a JavaScript project
❯ Create a TypeScript project
  Create a TypeScript project (with Viem)
  Create an empty hardhat.config.js
  Quit
```

1. Press `Enter` to confirm the default options in the project root.
2. Press `Enter` again to add a `.gitignore` file.
3. Press `Enter` to install the sample's project dependencies.

::: warning
It is important to clean up the default files created by Hardhat as Hardhat ignition is not compatible with MIDL. You can do this by running the following command:

```bash
rm -rf ignition test contracts/** 
```
:::

## Update `hardhat.config.ts`

The deployment of contracts on MIDL requires Bitcoin account, which is defined by the `MNEMONIC` variable. This variable should be set to a valid BIP39 mnemonic phrase that will be used to derive the Bitcoin account.


::: tip
To define the `MNEMONIC` variable, you can run the following command:

```bash
npx hardhat vars set MNEMONIC
```

and then paste your mnemonic when prompted.

See the official [Hardhat documentation](https://hardhat.org/hardhat-runner/docs/guides/configuration-variables) for more details.
:::

Add the following lines to your `hardhat.config.ts`. For more configuration options, refer to the [plugin documentation](../tools/contracts/config.md).

::: code-group

```ts [hardhat.config.ts]
import "@typechain/hardhat";
import "@midl/hardhat-deploy";
import "hardhat-deploy";
import "@nomicfoundation/hardhat-verify";
import { vars, type HardhatUserConfig } from "hardhat/config";
import { midlRegtest } from "@midl/executor";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  midl: {
    networks: {
      default: {
        mnemonic: vars.get("MNEMONIC"),
        confirmationsRequired: 1,
        btcConfirmationsRequired: 1,
      },
    },
  },
  networks: {
    default: {
      url: midlRegtest.rpcUrls.default.http[0],
      chainId: midlRegtest.id,
    },
  },
  etherscan: {
    apiKey: {
      "midl-regtest": "empty",
    },
    customChains: [
      {
        network: "midl-regtest",
        chainId: 777,
        urls: {
          apiURL: "https://blockscout.regtest.midl.xyz/api",
          browserURL: "https://blockscout.regtest.midl.xyz",
        },
      },
    ],
  },
};

export default config;
```

:::

## Create a New Contract

Create a new contract in the `contracts` directory:

```bash
touch contracts/SimpleStorage.sol
```

Add the following code to `contracts/SimpleStorage.sol`:

::: code-group
```solidity [SimpleStorage.sol]
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    string private message;

    event MessageUpdated(string newMessage);

    constructor(string memory initialMessage) {
        message = initialMessage;
    }

    function setMessage(string memory newMessage) public {
        message = newMessage;
        emit MessageUpdated(newMessage);
    }

    function getMessage() public view returns (string memory) {
        return message;
    }
}
```
:::

## Create a Deploy Script

Create a new deploy script in the `deploy` directory:

```bash
mkdir deploy
touch deploy/00_deploy_SimpleStorage.ts
```

::: code-group

```typescript [00_deploy_SimpleStorage.ts]
import type { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async (hre) => {
  /**
   * Initializes the MIDL hardhat deploy SDK
   */
  await hre.midl.initialize();

  /**
   * Add the deploy contract transaction intention
   */
  await hre.midl.deploy("SimpleStorage", ["Hello from MIDL!"]);

  /**
   * Sends the BTC transaction and EVM transaction to the network
   */
  await hre.midl.execute();
};

deploy.tags = ["main", "TERC20"];

export default deploy;
```

:::

## Deploy the Contract

::: warning
Make sure you have Bitcoin on Regtest. You can claim some at the [faucet](https://faucet.midl.xyz) or by contacting us directly on [Discord](https://discord.com/invite/midl). To get your Bitcoin account address, you can run the following command:

```bash
pnpm hardhat midl:address
```

Output example:


```
Bitcoin Address: bcrt1qf3r47tdpkn4rq6gq8kkfhw7l60q08lemmahgmf (p2wpkh)
EVM Address: 0x0130ddAA9bEc9552F11F17792b4EEED2b7d5E8Dd
```

:::

Run the following command to deploy the contract:

```bash
pnpm hardhat deploy
```

After the deployment is complete, you will see a folder named `deployments` in your project directory. Inside this folder, you will find a JSON file containing the contract address and other information.

## Verify source code

Now that your contract is deployed, you can verify it's source code on the block explorer using the following command:

```bash
pnpm hardhat verify REPLACE_WITH_CONTRACT_ADDRESS "Hello from MIDL" --network default
```

Successful verification will return the link to the contract on the block explorer. 

## Advanced Usage
Midl's hardhat-deploy offers more functionality than just deploying or writing to contracts. You can find commonly used functions [here](../tools/contracts/advanced-usage.md) and examples in [this repo](https://github.com/midl-xyz/smart-contract-deploy-starter).
