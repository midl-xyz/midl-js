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
| `config`    | `Config`                                | The configuration object.                                                                             |
| `intention` | [`PartialIntention`](#partialintention) | The intention to add.                                                                                 |
| `from`      | `string` (optional)                     | The BTC Address of the account to sign the transaction with. If omitted, the default account is used. |


### PartialIntention

| Name             | Type                                                                 | Description                                                                           |
| ---------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| evmTransaction   | [`TransactionSerializableBTC & { from?: Address }`](#evmtransaction) | EVM transaction details (with optional `from` address)                                |
| deposit          | `{ satoshis?: number; runes?: { id: string; amount: bigint; address: Address; }[] }` | Optional deposit details. Satoshis and/or runes to deposit.                           |
| withdraw         | `{ satoshis?: number; runes?: { id: string; amount: bigint; address: Address; }[] }` | Optional withdraw details. Satoshis and/or runes to withdraw.                         |

#### runes

| Name    | Type                 | Description                           |
| ------- | -------------------- | ------------------------------------- |
| id      | `string`             | Rune id                               |
| value   | `bigint`             | Amount of the rune to transfer        |
| address | `Address` (optional) | Address for state override (optional) |


## Returns

`Promise<TransactionIntention>` — The added intention object.

