# addTxIntention

> **addTxIntention**(`config`, `intention`, `from?`): `Promise<TransactionIntention>`

Creates a transaction intention with the provided parameters. This is a low-level utility for preparing a transaction intention object, typically used internally by higher-level transaction flows.

## Import

```ts
import { addTxIntention } from "@midl/executor";
```

## Example

```ts
import { addTxIntention } from "@midl/executor";

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

| Name           | Type                                                                 | Description                                                   |
| -------------- | -------------------------------------------------------------------- | ------------------------------------------------------------- |
| evmTransaction | [`TransactionSerializableBTC & { from?: Address }`](#evmtransaction) | EVM transaction details (with optional `from` address)        |
| deposit        | `Deposit`                                                            | Optional deposit details. Satoshis and/or runes to deposit.   |
| withdraw       | `Withdrawal`                                                         | Optional withdraw details. Satoshis and/or runes to withdraw. |


#### Deposit

| Name     | Type                         | Description                                                                            |
| -------- | ---------------------------- | -------------------------------------------------------------------------------------- |
| satoshis | `number` (optional)          | Amount in satoshis to deposit. If not provided, it will deposit all available balance. |
| runes    | `RunesTransfer[]` (optional) | Array of runes to transfer. If not provided, it will not deposit any runes.            |


#### Withdrawal

| Name     | Type                         | Description                                                                              |
| -------- | ---------------------------- | ---------------------------------------------------------------------------------------- |
| satoshis | `number` (optional)          | Amount in satoshis to withdraw. If not provided, it will withdraw all available balance. |
| runes    | `RunesTransfer[]` (optional) | Array of runes to transfer. If not provided, it will not withdraw any runes.             |

#### RunesTransfer

| Name    | Type      | Description                                      |
| ------- | --------- | ------------------------------------------------ |
| id      | `string`  | The rune ID, in the format `blockHeight:txIndex` |
| amount  | `bigint`  | The amount to transfer                           |
| address | `Address` | ERC20 address of the rune                        |


## Returns

`Promise<TransactionIntention>` — The added intention object.

