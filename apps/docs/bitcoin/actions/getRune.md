# getRune

> **getRune**(`config`, `runeId`): `Promise`\<[`GetRuneResponse`](#getruneresponse)\>

Gets a rune by its ID

## Import

```ts
import { getRune } from "@midl-xyz/midl-js-core";
```

## Example

```ts
const rune = await getRune(config, "1:1");
console.log(rune);
```

## Parameters

| Name   | Type                                                         | Description              |
| ------ | ------------------------------------------------------------ | ------------------------ |
| config | [`Config`](../configuration/index#creating-a-configuration-object) | The configuration object |
| runeId | `string`                                                     | The rune ID              |

## Returns

`Promise`\<[`GetRuneResponse`](#getruneresponse)\>

The rune object

### GetRuneResponse

| Name                    | Type             | Description           |
| ----------------------- | ---------------- | --------------------- |
| divisibility            | `number`         | The rune divisibility |
| id                      | `string`         | The rune ID           |
| location                | `object`         |                       |
| location.block_hash     | `string`         |                       |
| location.block_height   | `number`         |                       |
| location.timestamp      | `number`         |                       |
| location.tx_id          | `string`         |                       |
| location.tx_index       | `number`         |                       |
| mint_terms              | `object`         |                       |
| mint_terms.amount       | `number \| null` |                       |
| mint_terms.cap          | `number \| null` |                       |
| mint_terms.height_end   | `number \| null` |                       |
| mint_terms.height_start | `number \| null` |                       |
| mint_terms.offset_end   | `number \| null` |                       |
| mint_terms.offset_start | `number \| null` |                       |
| name                    | `string`         | The rune name         |
| number                  | `number`         | The rune number       |
| spaced_name             | `string`         | The rune spaced name  |
| supply                  | `object`         |                       |
| supply.burned           | `string`         |                       |
| supply.current          | `string`         |                       |
| supply.mint_percentage  | `string`         |                       |
| supply.mintable         | `boolean`        |                       |
| supply.minted           | `string`         |                       |
| supply.premine          | `string`         |                       |
| supply.total_burns      | `string`         |                       |
| supply.total_mints      | `string`         |                       |
| symbol                  | `string`         | The rune symbol       |
| turbo                   | `boolean`        |                       |
