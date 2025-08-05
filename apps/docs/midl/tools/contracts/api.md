---
order: 2
title: API Reference
---

# MidlHardhatEnvironment API Reference

The `MidlHardhatEnvironment` class provides a programmatic interface for deploying and interacting with contracts in a Bitcoin-EVM hybrid environment using Hardhat and MIDL tools.

## Constructor

```ts
new MidlHardhatEnvironment(hre: HardhatRuntimeEnvironment)
```

---

## Methods

### initialize
```ts
initialize(accountIndex?: number): Promise<void>
```
Initializes the environment and sets up the wallet and config.

---

### deploy
```ts
deploy(name: string, options?, intentionOptions?): Promise<void>
```
Deploys a contract by name with optional transaction and intention options.

---

### getDeployment
```ts
getDeployment(name: string): Promise<{ txId: string; address: Address; abi: any[] } | null>
```
Retrieves deployment information for a contract by name.

---

### callContract
```ts
callContract(name: string, methodName: string, options, intentionOptions?): Promise<void>
```
Calls a contract method by name with arguments and options.

---

### execute
```ts
execute(options?): Promise<void>
```
Executes all stored intentions as a batch transaction.

---

### getWalletClient
```ts
getWalletClient(): Promise<WalletClient>
```
Returns the wallet client instance.

---

### save
```ts
save(name: string, { abi, txId, address }): Promise<void>
```
Saves deployment information to disk.

---

### deleteDeployment
```ts
deleteDeployment(name: string): Promise<void>
```
Deletes deployment information for a contract by name.

---

### getConfig
```ts
getConfig(): Config | null
```
Returns the current MIDL config object.

---

### getEVMAddress
```ts
getEVMAddress(): string
```
Returns the EVM address for the default account.

---

## Properties

- **wallet**: `Wallet` — The wallet instance used for signing and account management.
- **bitcoinNetwork**: `BitcoinNetwork` — The current Bitcoin network.
- **chain**: `Chain` — The current EVM chain configuration.
