# disconnect

> **disconnect**(`config`): `Promise<void>`

Disconnects the current wallet connection and clears associated accounts.

## Import

```ts
import { disconnect } from "@midl/core";
```

## Example

```ts
import { disconnect } from "@midl/core";

await disconnect(config);
```

## Parameters

| Name   | Type                                                            | Description              |
| ------ | --------------------------------------------------------------- | ------------------------ |
| config | [`Config`](../configuration.md#creating-a-configuration-object) | The configuration object |

## Returns

`Promise<void>` – Resolves when the disconnection is complete.
