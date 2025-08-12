---
order: 1
title: "Advanced Usage"
---

# Advanced Usage
Midl's `hardhat-deploy` offers more functionality than just deploying or writing to contracts.

Common requests from developers include retrieving deployed smart contract addresses, adding rune deposits to function executions, rewriting deployment files, and more.

Below are some of the most common use cases.

Additionally, you can find the complete API [here](./api.md) and more advanced examples in [this repository](https://github.com/midl-xyz/smart-contract-deploy-starter).

If you find any missing functionality that would be useful, please open an issue on [GitHub](https://github.com/midl-xyz/midl-js/issues/new/choose).


## Retrieving an EVM Address
The EVM address is generated from the default BTC account derived from the mnemonic in [hardhat-config](./config.md).

In a `hardhat-deploy` function, you can retrieve it as follows:
```ts
const evmAddress = hre.midl.getEVMAddress();
```


## Retrieving a Bitcoin Address
The Bitcoin address is derived from the mnemonic in [hardhat-config](./config.md).

In a `hardhat-deploy` function, you can retrieve it as follows:
```ts
await hre.midl.initialize(); // retrieves account with index #0
const { address } = hre.midl.getAccount();
```


## Using Multiple Accounts During Deployment
Accounts are derived from the mnemonic in [hardhat-config](./config.md). You can change the account directly within deploy functions.

```ts
await hre.midl.initialize();
await hre.midl.deploy("MyContract", {
  args: ["Hello World!"]
});
await hre.midl.execute(); // Deployed by account with index #0

hre.midl.initialize(1);
await hre.midl.deploy("MyContract", {
  args: ["Hello world"]
});
await hre.midl.execute(); // Deployed by account with index #1
```


## Retrieving Deployed Contract Address & ABI
Deployed contract addresses and ABIs are stored by default in the `deployments` of your hardhat project folder as JSON files.

In a `hardhat-deploy` function, you can retrieve them as follows:
```ts
const { address, abi } = await hre.midl.getDeployment("MyContract");
```


## Passing BTC as Value to Deploy or Write Functions
You can pass the native token as a value to payable functions.

In a `hardhat-deploy` function, this can be done as follows:
```ts
const value = 1000; // Amount in satoshis

await hre.midl.deploy("MyContract", {
  args: ["Hello World!"],
  value: satoshisToWei(value) // attaching 1000 satoshis and multiplying by 10 * 10 ** 10 in msg.value
}, { 
    deposit: {
      satoshis: value
    }
});

await hre.midl.callContract("MyContract", "somePayableFunction", {
  value: satoshisToWei(value) // attaching 1000 satoshis and multiplying by 10 ** 10 in msg.value
}, {   
  deposit: {
      satoshis: value
    }
});
```


## Calling CompleteTx
[CompleteTx](../../actions/addCompleteTxIntention.md) allows you to withdraw your assets back to Bitcoin L1. A complete transaction retrieves native BTC and Runes on request.

::: tip
Calling `execute({ withdraw: true })` will automatically call `completeTx` and withdraw only native BTC.
:::

::: warning
Only add `withdraw` to the `callContract` or `deploy` transaction intentions if you the contract you are calling calls the `Executor` contract's `completeTx` function. Otherwise, if you want to withdraw assets, you must call `completeTx` directly.
:::

In a `hardhat-deploy` function, you can invoke this as follows:

```ts
await hre.midl.execute({ withdraw: {
  runes: [{ id: runeId, value: amount, address: runeAddress }],
}});
```


## Using a Rune with Your hardhat-deploy Function
You can use Runes in Midl functions and seamlessly utilize them with `hardhat-deploy`. Doing so will create a transfer of a Rune in the BTC transaction.

In a `hardhat-deploy` function, this can be done as follows:
```ts
const assetAddress = await getDeployment("ERC20Asset").address;
const myContractAddress = await getDeployment("MyContract").address;
const amount = 1n; // Amount in Rune units according to the Rune's decimals

await hre.midl.callContract("ERC20Asset", "approve", {
  args: [myContractAddress, amount]
});

await hre.midl.callContract(
  "MyContract",
  "functionWithRuneTransfer",
  {
    args: [amount]
  },
  {
    deposit: {
      runes: [
        {
          id: "1:1", // Rune ID may be attached manually or found by token address using midl-js-executor util
          value: amount,
          address: assetAddress // Mirrored ERC20 asset
        }
      ]
    }
  }
);
```


## Skip Estimate Gas
::: warning
This is a dangerous feature—please use it at your own risk. If your transaction reverts, transaction fees will still be charged.
:::

This option allows you to bypass gas estimation before executing a transaction. It’s particularly helpful when transactions are failing silently and you need deeper insight into what’s going wrong - for example, by inspecting the raw transaction trace through an RPC call or block explorer.

In a `hardhat-deploy` function, this can be done as follows:
```ts
await hre.midl.initialize();

// some deployment functions

hre.midl.execute({
  skipEstimateGas: true, // Skips gas estimation
});
```


## Deploying a Proxy
You can deploy proxy contracts in the same way as with the standard `hardhat-deploy` library.

Please see a complete example [here](https://github.com/midl-xyz/smart-contract-deploy-starter).
