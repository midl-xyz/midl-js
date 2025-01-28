# getRuneUTXO

> **getRuneUTXO**(`config`, `address`, `runeId`): `Promise`\<[`RuneUTXO`](#runeutxo)[]\>

Retrieves the UTXOs associated with a specific rune for a given address.
This is useful for obtaining the necessary UTXOs to create a PSBT for that rune.

## Import

```ts
import { getRuneUTXO } from "@midl-xyz/midl-js-core";
```

## Example

```ts
const utxos = await getRuneUTXO(config, "bc1q...", "1:1");
console.log(utxos);
```

## Parameters

| Name    | Type                                                         | Description                     |
| ------- | ------------------------------------------------------------ | ------------------------------- |
| config  | [`Config`](../configuration/index#creating-a-configuration-object) | The configuration object        |
| address | `string`                                                     | The address to get the UTXOs of |
| runeId  | `string`                                                     | The rune ID to get the UTXOs of |

## Returns

`Promise`\<[`RuneUTXO`](#runeutxo)[]\>

The UTXOs for the rune for the address

### RuneUTXO

| Name     | Type       | Description             |
| -------- | ---------- | ----------------------- |
| address  | `string`   | The address of the UTXO |
| height   | `number`   | The height of the UTXO  |
| runes    | `object[]` | The runes in the UTXO   |
| satoshis | `number`   | The amount of satoshis  |
| scriptPk | `string`   | The scriptPubKey        |
| txid     | `string`   | The txid of the UTXO    |
| vout     | `number`   | The vout of the UTXO    |
