# addCompleteTxIntention

> **addCompleteTxIntention**(`config`, `assetsToWithdraw?`): `Promise<TransactionIntention>`

Creates a CompleteTx Intention. This prepares an EVM transaction that calls the `completeTx` function on the Executor contract. The `completeTx` is used to create a transaction to withdraw assets from the MIDL Layer and reflect the execution result to the Bitcoin network.

## Import

```ts
import { addCompleteTxIntention } from "@midl/executor";
```

## Example

```ts
import { addCompleteTxIntention } from "@midl/executor";

const intention = await addCompleteTxIntention(config, [btcAddress, runeAddress]);
```

## Parameters

| Name       | Type                                           | Description               |
| ---------- | ---------------------------------------------- | ------------------------- |
| `config`   | `Config`                                       | The configuration object. |
| `withdraw` | [`Withdrawal`](./addTxIntention.md#withdrawal) | The assets to withdraw    |
## Returns

`Promise<TransactionIntention>` — The prepared transaction intention object.

## Notes
- The function automatically determines the correct receiver addresses for BTC and runes based on the current config accounts.
