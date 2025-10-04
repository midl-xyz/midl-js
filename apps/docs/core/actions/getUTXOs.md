# getUTXOs

> **getUTXOs**(`config`, `address`, `includeRunes`): `Promise`\<[`UTXO`](#utxo)[]\>

Gets the UTXOs for an address, optionally including UTXOs with Runes

## Import

```ts
import { getUTXOs } from "@midl/core";
```

### Example

```ts
const utxos = await getUTXOs(config, "bc1q...");
console.log(utxos);
```

## Parameters

| Name         | Type                                                            | Description                       |
| ------------ | --------------------------------------------------------------- | --------------------------------- |
| config       | [`Config`](../configuration.md#creating-a-configuration-object) | The configuration object          |
| address      | `string`                                                        | The address to get the UTXOs of   |
| includeRunes | `boolean` = `false`                                             | If true, include UTXOs with Runes |

## Returns

`Promise`\<[`UTXO`](#utxo)[]\>

The UTXOs for the address

### UTXO

| Property            | Type      | Description                    |
| ------------------- | --------- | ------------------------------ |
| txid                | `string`  | The transaction ID of the UTXO |
| vout                | `number`  | The output index of the UTXO   |
| value               | `number`  | The value of the UTXO          |
| status              | `object`  | The status of the UTXO         |
| status.confirmed    | `boolean` | Whether the UTXO is confirmed  |
| status.block_height | `number`  | The block height of the UTXO   |
