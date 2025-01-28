# switchNetwork

> **switchNetwork**(`config`, `network`): `Promise`\<`void`\>

Switches the network to the given network.

## Import

```ts
import { switchNetwork } from "@midl-xyz/midl-js-core";
```

## Example

```ts
import { switchNetwork, mainnet } from "@midl-xyz/midl-js-core";

await switchNetwork(config, mainnet);
```

## Parameters

| Name    | Type                                                         | Description              |
| ------- | ------------------------------------------------------------ | ------------------------ |
| config  | [`Config`](../configuration#creating-a-configuration-object) | The configuration object |
| network | `BitcoinNetwork`                                             | The network to switch to |

## Returns

`Promise`\<`void`\>
