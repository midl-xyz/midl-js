# addTxIntention

> **addTxIntention**(`config`, `store`, `intention`, `reset`, `publicKey?`): `Promise`\<[`TransactionIntention`](#transactionintention)\>

Add a transaction intention to the store

## Import

```ts
import { addTxIntention } from "@midl-xyz/midl-js-executor";
```

## Example

```ts
const intention = await addTxIntention(config, store, {
  evmTransaction: {
    to: "0x...",
    data: "0x...",
  },
  value: 100n,
  hasDeposit: true,
});
console.log(intention);
```

## Parameters

| Name       | Type                                                                       | Description                                                     |
| ---------- | -------------------------------------------------------------------------- | --------------------------------------------------------------- |
| config     | [`Config`](../../bitcoin/configuration.md#creating-a-configuration-object) | The configuration object                                        |
| store      | `Store`                                                                    | The store object                                                |
| intention  | [`PartialIntention`](#partialintention)                                    | The intention to add                                            |
| reset?     | `boolean`                                                                  | If true, the intentions array will be reset. Default is `false` |
| publicKey? | `string`                                                                   | Public key to use to sign the transaction                       |

### PartialIntention

Defined in [packages/executor/src/actions/addTxIntention.ts](https://github.com/midl-xyz/midl-js/blob/main/packages/executor/src/actions/addTxIntention.ts#L9)

## Returns

`Promise`\<[`TransactionIntention`](#transactionintention)\> - The added intention

### TransactionIntention

| Name                  | Type                             | Description                                         |
| --------------------- | -------------------------------- | --------------------------------------------------- |
| evmTransaction        | `TransactionSerializableBTC`     | EVM transaction to execute                          |
| signedEvmTransaction? | `string`                         | Serialized signed EVM transaction                   |
| value?                | `bigint`                         | Native token value to transfer to Midl              |
| rune?                 | `{ id: string; value: bigint; }` | Rune id and value to transfer to Midl               |
| hasRunesWithdraw?     | `boolean`                        | If true, the intention contains runes to withdraw   |
| hasWithdraw?          | `boolean`                        | If true, the intention contains Bitcoin to withdraw |
| hasDeposit?           | `boolean`                        | If true, the intention contains a Bitcoin deposit   |
| hasRunesDeposit?      | `boolean`                        | If true, the intention contains a Rune deposit      |
