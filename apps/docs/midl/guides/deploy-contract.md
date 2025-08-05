# Deploy Contract

::: warning
THE DOCUMENTATION IS OUTDATED AND MAY NOT REFLECT THE CURRENT STATE OF THE PROJECT.
:::

The process of deploying contract to MIDL Protocol is similar to deploying contract to Ethereum. However to get the best experience, we recommend using the `@midl-xyz/hardhat-deploy` plugin alongside with [hardhat-deploy](https://github.com/wighawag/hardhat-deploy).

You can find the example in [apps/docs/examples](https://github.com/midl-xyz/midl-js/tree/main/apps/docs/examples)

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

Choose `Create an empty hardhat.config.js`:

```bash
? What do you want to do? …
  Create a JavaScript project
  Create a TypeScript project
  Create a TypeScript project (with Viem)
❯ Create an empty hardhat.config.js
  Quit
```

## Update `hardhat.config.js`

Add the following lines to your `hardhat.config.js`:

::: tip

To defined the `MNEMONIC` variable, you can use the `npx hardhat vars set MNEMONIC` command.

:::

```javascript{1-4,9-21}
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
  networks: {
    default: {
      url: midlRegtest.rpcUrls.default.http[0],
      chain: midlRegtest.id,
    },
  },
};
```

## Create a new contract

Create a new contract in the `contracts` directory:

```bash
mkdir contracts
touch contracts/SimpleStorage.sol
```

Add the following code to `contracts/SimpleStorage.sol`:

```solidity
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

## Create a deploy script

Create a new deploy script in the `deploy` directory:

```bash
mkdir deploy
touch deploy/00_deploy_SimpleStorage.js
```

::: code-group

```javascript [00_deploy_SimpleStorage.js]
/**
 *
 * @param {import('hardhat/types').HardhatRuntimeEnvironment} hre
 */
module.exports = async function deploy(hre) {
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
```

:::

## Deploy the contract

Run the following command to deploy the contract:

```bash
npx hardhat deploy
```

After the deployment is complete, you will see a folder named `deployments` in your project directory. Inside this folder, you will find a JSON file containing the contract address and other information.
