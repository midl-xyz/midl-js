---
order: 1
title: "Advanced Usage"
---

# Advanced Usage
Midl's `hardhat-deploy` offers more functionality than just deploying or writing to contracts.

Common requests from developers include retrieving deployed smart contract addresses, adding rune deposits to function executions, rewriting deployment files, and more.

Below are some of the most common use cases.

Additionally, you can find the complete API [here](./api.md) and more advanced examples in [this repository](https://github.com/midl-xyz/smart-contract-deploy-starter).

If you find any missing functionality that would be useful, please open an issue on [GitHub](https://github.com/midl-xyz/midl-js).


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


### Using Multiple Accounts During Deployment
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


### Retrieving Deployed Contract Address & ABI
Deployed contract addresses and ABIs are stored by default in the `/deployments` folder as JSON files.

In a `hardhat-deploy` function, you can retrieve them as follows:
```ts
const { address, abi } = await hre.midl.getDeployment("MyContract");
```


### Passing BTC as Value to Deploy or Write Functions
You can pass the native token as a value to payable functions.

In a `hardhat-deploy` function, this can be done as follows:
```ts
await hre.midl.deploy("MyContract", {
  args: ["Hello World!"],
  value: 1n // attaching 1 wei as msg.value
});

await hre.midl.callContract("MyContract", "somePayableFunction", {
  value: 1n // attaching 1 wei as msg.value
});
```


### Calling CompleteTx
[CompleteTx](../../actions/addCompleteTxIntention.md) allows you to withdraw your assets back to Bitcoin L1. A complete transaction can retrieve either native BTC or Runes.

::: tip
Passing only `shouldComplete: true` to `execute({})` will retrieve only native sats.
:::

::: warning
To retrieve runes, you must include the transaction intention:
```ts
{ hasRunesWithdraw: true, runes: [{ id, amount, runeAddress }] }
```

and add `assetsToWithdraw` together with `shouldComplete` to the `execute({})` call:
```ts
{ assetsToWithdraw: [runeAddress], shouldComplete: true }
```
:::

In a `hardhat-deploy` function, you can invoke this as follows:
```ts
await hre.midl.callContract(
  "RunesRelayer",
  "withdrawRune",
  { args: [amount] },
  {
    hasRunesWithdraw: true,
    runes: [{ id: runeId, value: amount, address: runeAddress }],
  },
);

await hre.midl.execute({ assetsToWithdraw: [runeAddress], shouldComplete: true });
```


### Using a Rune with Your hardhat-deploy Function
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
    hasRunesDeposit: true,
    runes: [
      {
        id: "1:1", // Rune ID may be attached manually or found by token address using midl-js-executor util
        value: amount,
        address: assetAddress // Mirrored ERC20 asset
      }
    ],
  }
);
```


### Skip Estimate Gas
::: warning
This is a dangerous feature—please use it at your own risk. If your transaction reverts, transaction fees will still be charged.
:::

You can use Runes in Midl functions and seamlessly utilize them with `hardhat-deploy`. Doing so will create a transfer of a Rune in the BTC transaction.

In a `hardhat-deploy` function, this can be done as follows:
```ts
await hre.midl.initialize();

// some deployment functions

hre.midl.execute({
  skipEstimateGasMulti: true, // Skips gas estimation
});
```


### Deploying a Proxy
You can deploy proxy contracts in the same way as with the standard `hardhat-deploy` library.

Please see a complete example [here](https://github.com/midl-xyz/smart-contract-deploy-starter).
