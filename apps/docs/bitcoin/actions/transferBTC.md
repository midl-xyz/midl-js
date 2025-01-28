# transferBTC

> **transferBTC**(`config`, `params`): `Promise`\<[`TransferBTCResponse`](#transferbtcresponse)\>

Transfers BTC with the given parameters. Optionally, it can broadcast the transaction.

## Import

```ts
import { transferBTC } from "@midl-xyz/midl-js-core";
```

## Example

```ts
const tx = await transferBTC(config, {
  transfers: [
    { receiver: "tb1q...", amount: 10000 },
    { receiver: "tb1q...", amount: 20000 },
  ],
  feeRate: 1,
  publish: true,
});

console.log(tx);
```

## Parameters

| Name   | Type                                                               | Description                     |
| ------ | ------------------------------------------------------------------ | ------------------------------- |
| config | [`Config`](../configuration/index#creating-a-configuration-object) | The configuration object        |
| params | [`TransferBTCParams`](#transferbtcparams)                          | The parameters for the transfer |

### TransferBTCParams

| Name               | Type       | Description                                  |
| ------------------ | ---------- | -------------------------------------------- |
| transfers          | `object[]` | An array of transfers                        |
| transfers.receiver | `string`   | The receiver address                         |
| transfers.amount   | `number`   | The amount in satoshis to transfer           |
| feeRate?           | `number`   | The fee rate in satoshis per byte            |
| publish?           | `boolean`  | If true, the transaction will be broadcasted |
| from?              | `string`   | The address to transfer the BTC from         |

## Returns

`Promise`\<[`TransferBTCResponse`](#transferbtcresponse)\>

The PSBT and transaction data

### TransferBTCResponse

| Name   | Type     | Description                |
| ------ | -------- | -------------------------- |
| psbt   | `string` | Signed Base64 encoded PSBT |
| tx     | `object` | The transaction            |
| tx.id  | `string` | The transaction ID         |
| tx.hex | `string` | The transaction hex        |
