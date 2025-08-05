# addTxIntention

> **addTxIntention**(`config`, `intention`, `from?`): `Promise<TransactionIntention>`

Creates a transaction intention with the provided parameters. This is a low-level utility for preparing a transaction intention object, typically used internally by higher-level transaction flows.

## Import

```ts
import { addTxIntention } from "@midl-xyz/midl-js-executor";
```

## Example

```ts
import { addTxIntention } from "@midl-xyz/midl-js-executor";

const intention = await addTxIntention(config, {
  // ...partial intention fields
});
```

## Parameters

| Name        | Type                                    | Description                                                                                           |
| ----------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `config`    | [`Config`](../../reference/Config.md)   | The configuration object.                                                                             |
| `intention` | [`PartialIntention`](#partialintention) | The intention to add.                                                                                 |
| `from`      | `string` (optional)                     | The BTC Address of the account to sign the transaction with. If omitted, the default account is used. |


### PartialIntention

| Name             | Type                                                                 | Description                                                                           |
| ---------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| evmTransaction   | [`TransactionSerializableBTC & { from?: Address }`](#evmtransaction) | EVM transaction details (with optional `from` address)                                |
| satoshis         | `number` (optional)                                                  | BTC amount to transfer to MIDL in satoshis                                            |
| runes            | `{ id: string; value: bigint; address?: Address; }[]` (optional)     | Array of runes to transfer to MIDL. Each rune has an id, value, and optional address. |
| hasRunesWithdraw | `boolean` (optional)                                                 | If true, the intention contains runes to withdraw                                     |
| hasWithdraw      | `boolean` (optional)                                                 | If true, the intention contains Bitcoin to withdraw                                   |
| hasRunesDeposit  | `boolean` (optional)                                                 | If true, the intention contains a Rune deposit                                        |

#### runes

| Name    | Type                 | Description                           |
| ------- | -------------------- | ------------------------------------- |
| id      | `string`             | Rune id                               |
| value   | `bigint`             | Amount of the rune to transfer        |
| address | `Address` (optional) | Address for state override (optional) |


## Returns

`Promise<TransactionIntention>` — The added intention object.

