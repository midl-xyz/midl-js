# getRunes

> **getRunes**(`config`, `params`): `Promise`\<[`GetRunesResponse`](#getrunesresponse)\>

Gets the runes for an address, with optional limit and offset.

## Import

```ts
import { getRunes } from "@midl-xyz/midl-js-core";
```

## Example

```ts
const runes = await getRunes(config, {
  address: "bc1q...",
});

console.log(runes);
```

## Parameters

| Name   | Type                                                            | Description                    |
| ------ | --------------------------------------------------------------- | ------------------------------ |
| config | [`Config`](../configuration.md#creating-a-configuration-object) | The configuration object       |
| params | [`GetRunesParams`](#getrunesparams)                             | The parameters for the request |

### GetRunesParams

| Name    | Type     | Description                            |
| ------- | -------- | -------------------------------------- |
| address | `string` | The address to get the runes of        |
| limit?  | `number` | The maximum number of runes to get     |
| offset? | `number` | The offset to start getting runes from |

## Returns

`Promise`\<[`GetRunesResponse`](#getrunesresponse)\>

### GetRunesResponse

| Property | Type                      | Description               |
| -------- | ------------------------- | ------------------------- |
| limit    | `number`                  | The limit of runes        |
| offset   | `number`                  | The offset of runes       |
| total    | `number`                  | The total number of runes |
| results  | `array`<[`Rune`](#rune)\> | The runes for the address |

### Rune

| Property         | Type     | Description             |
| ---------------- | -------- | ----------------------- |
| rune             | `object` | The rune details        |
| rune.id          | `string` | The rune ID             |
| rune.number      | `number` | The rune number         |
| rune.name        | `string` | The rune name           |
| rune.spaced_name | `string` | The rune spaced name    |
| balance          | `string` | The balance of the rune |
| address          | `string` | The address             |
