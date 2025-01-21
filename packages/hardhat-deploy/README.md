# @midl-xyz/hardhat-deploy

A hardhat plugin to deploy contract to the MIDL ecosystem.
Use this plugin alongside with [hardhat-deploy](https://github.com/wighawag/hardhat-deploy) to get the best experience.

## Installation

```bash
pnpm add @midl-xyz/hardhat-deploy
```

## Usage

Add the following lines to your `hardhat.config.js`:

```javascript
import "@midl-xyz/hardhat-deploy";

module.exports = {
  midl: {
    mnemonic: "your mnemonic",
    path: "deployments",
  },
  networks: {
    default: {
      url: "https://evm-rpc.regtest.midl.xyz",
      chainId: 777,
    },
  },
};
```

### Deploying a contract

```javascript
export default async function deploy(hre) {
  await hre.midl.initialize();
  const deployer = await hre.midl.getAddress();

  await hre.midl.deploy("YourContract", {
    from: deployer,
    args: [100],
  });

  await hre.midl.execute();
}
```
