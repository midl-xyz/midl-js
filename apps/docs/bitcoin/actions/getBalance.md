# getBalance

> **getBalance**(`config`, `address`): `Promise`\<`number`\>

Gets the balance of an address accumulated from UTXOs

## Import

```ts
import { getBalance } from "@midl-xyz/midl-js-core";
```

## Example

```ts
const balance = await getBalance(config, "bc1q...");
console.log(balance);
```

## Parameters

| Name    | Type                                                         | Description                       |
| ------- | ------------------------------------------------------------ | --------------------------------- |
| config  | [`Config`](../configuration#creating-a-configuration-object) | The configuration object          |
| address | `string`                                                     | The address to get the balance of |

## Returns

`Promise`\<`number`\>

The balance in satoshis
