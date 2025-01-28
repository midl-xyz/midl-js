# getBlockNumber

> **getBlockNumber**(`config`): `Promise`\<`number`\>

Gets the current block number

## Import

```ts
import { getBlockNumber } from "@midl-xyz/midl-js-core";
```

## Example

```ts
const blockNumber = await getBlockNumber(config);
console.log(blockNumber);
```

## Parameters

| Name   | Type                                                         | Description              |
| ------ | ------------------------------------------------------------ | ------------------------ |
| config | [`Config`](../configuration/index#creating-a-configuration-object) | The configuration object |

## Returns

`Promise`\<`number`\>

The current block number
