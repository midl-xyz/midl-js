# edictRune

> **edictRune**(`config`, `params`): `Promise`\<[`EdictRuneResponse`](#edictruneresponse)\>

Edicts (transfers) one or more runes to one or more receivers. It also supports transferring bitcoin.

::: warning
Only two different runes could be transferred at a time due to Bitcoin's transaction size limit.
:::

## Import

```ts
import { edictRune } from "@midl-xyz/midl-js-core";
```

## Example

```ts
edictRune(config, {
  transfers: [
    {
      runeId: "1:1",
      amount: 100n,
      receiver: "tb1q9zj...zj9q",
    },
  ],
});
```

## Parameters

| Name   | Type                                                            | Description              |
| ------ | --------------------------------------------------------------- | ------------------------ |
| config | [`Config`](../configuration.md#creating-a-configuration-object) | The configuration object |
| params | [`EdictRuneParams`](#edictruneparams)                           | Edict rune parameters    |

### EdictRuneParams

| Name      | Type                                                                                                                       | Description                                                       |
| --------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| feeRate?  | `number`                                                                                                                   | The fee rate in satoshis per byte                                 |
| from?     | `string`                                                                                                                   | The address to transfer the rune from                             |
| publish?  | `boolean`                                                                                                                  | If true, the transaction will be broadcasted                      |
| transfers | (\{ `amount`: `bigint`; `receiver`: `string`; `runeId`: `string`; \} \| \{ `amount`: `number`; `receiver`: `string`; \})[] | An array of transfers, supporting both rune and bitcoin transfers |

## Returns

`Promise`\<[`EdictRuneResponse`](#edictruneresponse)\>

The PSBT and transaction data

### EdictRuneResponse

| Name   | Type     | Description          |
| ------ | -------- | -------------------- |
| psbt   | `string` | Base64-encoded PSBT  |
| tx     | `object` | The transaction data |
| tx.hex | `string` | The transaction hex  |
| tx.id  | `string` | The transaction id   |
