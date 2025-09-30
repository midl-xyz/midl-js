# broadcastTransaction

> **broadcastTransaction**(`config`, `txHex`): `Promise`\<`string`\>

Broadcasts a transaction to the bitcoin network. If the transaction is successfully broadcasted, the transaction hash is returned.

## Import

```ts
import { broadcastTransaction } from "@midl/core";
```

## Example

```ts
import { broadcastTransaction } from "@midl/core";

const txHex = "02000000000101...";
const txHash = await broadcastTransaction(config, txHex);
console.log(txHash);
```

## Parameters

| Name   | Type                                                            | Description              |
| ------ | --------------------------------------------------------------- | ------------------------ |
| config | [`Config`](../configuration.md#creating-a-configuration-object) | The configuration object |
| txHex  | `string`                                                        | The transaction hex      |

## Returns

`Promise`\<`string`\> - The transaction hash
