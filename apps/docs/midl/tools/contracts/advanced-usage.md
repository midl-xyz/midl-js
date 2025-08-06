---
order: 1
title: "Advanced Usage"
---

# Advanced Usage
Midl's hardhat-deploy offer more functionality then just deploying or writing to contracts.

Common requests from developers is to be able to retrieve deployed smart contract addresses, add runes deposit to the function execution, rewrite the deployment file and so on...

You may find the most common of those below.

Additionally, uou may find complete available API [here](./api.md) & Some more advanced examples in [this repo](https://github.com/midl-xyz/smart-contract-deploy-starter).


If there is a missing functionality that you may find useful - please don't hesitate to open an Issue in [GitHub](https://github.com/midl-xyz/midl-js)

## Advanced Usage

### Retrieving an EVM Address
EVM address is generated from the default btc account derived of the Mnemonic in [hardhat-config](./config.md)

In a hardhat deploy function it may be retrieved with the following:
```ts
const evmAddress = hre.midl.getEVMAddress();
```

### Retrieving a Bitcoin Address
Bitcoin address is derived from the Mnemonic in [hardhat-config](./config.md)

In a hardhat deploy function it may be retrieved with the following:
```ts
hre.midl.init(); // retrieved account with the index #0
const btcAddress = midl.getConfig()?.getState()?.accounts?.[0].address
```

### Using multiple accounts during deployment
Accounts are derived from the Mnemonic in [hardhat-config](./config.md)
It is possible to change the accounts directly within the deploy functions.

```ts
hre.midl.init();
await midl.deploy("MyContract", { 
    args: ["Hello World!"]
 });
hre.midl.execute(); // Deployed by account with the index #0

hre.midl.init(1);
await midl.deploy("MyContract", {
    args: ["Hello world"]
});
hre.midl.execute(); // Deployed by account with the index #1

```

### Retrieving deployed contract address & abi
Deployed contracts address & abi are by default stored in /deployments folder in json files

In a hardhat deploy function it may be retrieved with the following:
```ts
const {address, abi} = await hre.midl.getDeployment("MyContract");
```

### Passing BTC as value to deploy or write function
It is possible to pass native token as a value to payable functions.

In a hardhat deploy function it is utilized in the following way:
```ts
await midl.deploy("MyContract", { 
    args: ["Hello World!"], 
    value: BigInt(1)// attaching 1 wei as msg.value
 });

await midl.callContract("MyContract", "somePayableFunction", {
    value: BigInt(1) // attaching 1 wei as msg.value
  });
```

### Using a Rune with your hardhat-deploy function
It is possible to use Runes in Midl functions & seamlessly utilize them with hardhat-deploy. Choosing to do so - hardhat deploy is going to create a transfer of a rune in the BTC Transaction.

In a hardhat deploy function it is utilized in the following way:
```ts
const assetAddress = await getDeployment("ERC20Asset").address;
const myContractAddress = await getDeployment("MyContract").address;

await midl.callContract("ERC20Asset", "approve", { 
    args: [myContractAddress, BigInt(1)]
    });

await midl.callContract("MyContract", "functionWithRuneTransfer", {
    value: BigInt(1) // attaching 1 wei as msg.value
  },
  {
    hasRunesDeposit: true,
    runes: [{ 
        id: "1:1", // Rune ID may be attached manually or found by token address using midl-js-executor util
        value: BigInt(1), // in wei
        address: assetAddress // Mirrored ERC20 asset
        }],
  }
  );
```

### Deploying a Proxy
It is possible to deploy proxy contracts same with usual hardhat-deploy library.

Please check a complete example [here](TODO)
