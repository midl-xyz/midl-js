# Deploy Contract

The process of deploying a contract to MIDL is similar to deploying on EVM-compatible networks, with the key difference that every deployment and write transaction requires interaction with Bitcoin L1. For the best experience, we recommend using the `@midl-xyz/hardhat-deploy` plugin together with [hardhat-deploy](https://github.com/wighawag/hardhat-deploy).

You can find advanced examples in [this repo](https://github.com/midl-xyz/smart-contract-deploy-starter)

## Create a new project

First, create a new project using the following command:

```bash
mkdir hardhat-midl
cd hardhat-midl
pnpm init
pnpm add -D hardhat @midl-xyz/hardhat-deploy hardhat-deploy @midl-xyz/midl-js-executor
```

## Initialize Hardhat

Run the following command to initialize Hardhat:

```bash
npx hardhat init
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

1. Press `Enter` to confirm the default options on project root
2. Press `Enter` again to add .gitignore file
3. Choose if you wish to share data with Hardhat team over the bugs

## Update `hardhat.config.ts`

::: tip

To define the `MNEMONIC` variable, you can run the following command:
 `npx hardhat vars set MNEMONIC` 
and then paste your mnemonic when prompted.

See official [Hardhat documentation](https://hardhat.org/hardhat-runner/docs/guides/variables) for more details.
:::

Add the following lines to your `hardhat.config.ts`:

::: code-group

```ts [hardhat.config.ts]
import "@typechain/hardhat";
import "@midl-xyz/hardhat-deploy";
import "hardhat-deploy";
import "@nomicfoundation/hardhat-verify";
import { vars, type HardhatUserConfig } from "hardhat/config";
import { midlRegtest } from "@midl-xyz/midl-js-executor";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  midl: {
    path: "deployments",
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

## Create a new contract

Delete default contract provided by Hardhat in `contracts` directory.
Create a new contract in the `contracts` directory:

```bash
rm -rf contracts/**.sol
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

## Create a deploy script

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
   * Initializes MIDL hardhat deploy SDK
   */
  await hre.midl.initialize();

  /**
   * Add the deploy contract transaction intention
   */
  await hre.midl.deploy("SimpleStorage", {
    args: ["Hello from MIDL!"],
  });

  /**
   * Sends the BTC transaction and EVM transaction to the network
   */
  await hre.midl.execute();
};

deploy.tags = ["main", "TERC20"];

export default deploy;
```

:::

## Deploy the contract

::: warning
Make sure you have a Bitcoin on Regtest. You can claim some at [faucet](https://faucet.midl.xyz) or by contacting us directly at [Discord](https://discord.com/invite/midl)
:::

Run the following command to deploy the contract:

```bash
pnpm hardhat deploy
```

After the deployment is complete, you will see a folder named `deployments` in your project directory. Inside this folder, you will find a JSON file containing the contract address and other information.


## Verify the contract
Now that your contract is deployed, you can verify it using the following command:
```bash
pnpm hardhat verify CONTRACT_ADDRESS "Hello from MIDL" --network default
```

Successful verification will return the contract address and the transaction hash.


## Advanced Usage
Midl's hardhat-deploy offers more functionality than just deploying or writing to contracts. You may find commonly used functions [here](../tools/contracts/advanced-usage.md) & examples in [this repo](https://github.com/midl-xyz/smart-contract-deploy-starter)

