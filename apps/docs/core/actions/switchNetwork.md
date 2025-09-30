# switchNetwork

> **switchNetwork**(`config`, `network`): `Promise`\<`void`\>

Switches the network to the given network.

## Import

```ts
import { switchNetwork } from "@midl/core";
```

## Example

```ts
import { switchNetwork, mainnet } from "@midl/core";

await switchNetwork(config, mainnet);
```

## Parameters

| Name    | Type                                                            | Description              |
| ------- | --------------------------------------------------------------- | ------------------------ |
| config  | [`Config`](../configuration.md#creating-a-configuration-object) | The configuration object |
| network | `BitcoinNetwork`                                                | The network to switch to |

## Returns

`Promise`\<`void`\>
