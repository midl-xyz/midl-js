---
order: 2
title: API Reference
---

# Hardhat Plugin API Reference

The Hardhat plugin injects `hre.midl`, which provides a programmatic interface for deploying and interacting with contracts in a Bitcoin-EVM hybrid environment using Hardhat and MIDL tools.

## Methods

### initialize
```ts
initialize(accountIndex?: number): Promise<Config>
```
Initializes the environment and sets up the wallet and config.

---

### deploy
```ts
deploy(
  name: string,
  args?: unknown[],
  options?: DeployContractOptions,
  overrides?: DeployContractIntentionOverrides
): Promise<{ address: Address; abi: any[] } | DeploymentData>
```
Adds a deployment intention. If the contract is already deployed, returns the stored deployment data.

---

### get
```ts
get(name: string): Promise<DeploymentData | null>
```
Retrieves deployment information for a contract by name.

---

### read
```ts
read(name: string, functionName: string, args?, options?): Promise<unknown>
```
Reads a contract method using the current deployment address.

### write
```ts
write(
  name: string,
  functionName: string,
  args?,
  evmTransactionOverrides?,
  options?
): Promise<TransactionIntention>
```
Adds a contract write intention (EVM call).
`options` maps to the intention overrides (for example, `deposit`).

---

### addTxIntention
```ts
addTxIntention(data: PartialIntention): Promise<TransactionIntention>
```
Adds a raw transaction intention directly to the internal store. This is useful when you need full control over the intention data beyond `deploy` and `write`.
Requires `initialize()`.

---

### addRuneERC20Intention
```ts
addRuneERC20Intention(runeId: string): Promise<TransactionIntention>
```
Creates a Rune ERC20 intention and adds it to the internal store.
Requires `initialize()`.

---

### execute
```ts
execute(options?): Promise<[string, `0x${string}`[]] | null>
```
Finalizes and broadcasts the BTC and EVM transactions. Returns BTC tx id and EVM tx hashes (or `null` if there are no intentions).

---

### save
```ts
save(name: string, { abi, txId, address }): Promise<void>
```
Saves deployment information to disk.

---

### delete
```ts
delete(name: string): Promise<void>
```
Deletes deployment information for a contract by name.

---

## Properties

- **account**: `Account` — The default account (requires `initialize()`).
- **evm.address**: `string` — The EVM address for the default account (requires `initialize()`).
- **config**: `Config` — The initialized MIDL config (requires `initialize()`).
- **publicClient**: `PublicClient` — The viem public client used by the plugin.
