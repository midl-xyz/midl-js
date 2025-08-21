# getRuneBalance

> **getRuneBalance**(`config`, `params`): `Promise`\<[`GetRuneBalanceResponse`](#getrunebalanceresponse)\>

Gets the balance of a rune for an address

## Import

```ts
import { getRuneBalance } from "@midl/core";
```

## Example

```ts
const balance = await getRuneBalance(config, {
  address: "bc1q...",
  runeId: "1:1",
});
console.log(balance);
```

## Parameters

| Name   | Type                                                            | Description                    |
| ------ | --------------------------------------------------------------- | ------------------------------ |
| config | [`Config`](../configuration.md#creating-a-configuration-object) | The configuration object       |
| params | [`GetRuneBalanceParams`](#getrunebalanceparams)                 | The parameters for the request |

### GetRuneBalanceParams

| Name    | Type     | Description                       |
| ------- | -------- | --------------------------------- |
| address | `string` | The address                       |
| runeId  | `string` | The rune ID to get the balance of |

## Returns

`Promise`\<[`GetRuneBalanceResponse`](#getrunebalanceresponse)\>

The balance of the rune for the address

### GetRuneBalanceResponse

| Name     | Type     | Description             |
| -------- | -------- | ----------------------- |
| address? | `string` | The address             |
| balance  | `string` | The balance of the rune |
