# addNetwork

> **addNetwork**(`config`, `connectorId`, `networkConfig`): `Promise<void>`

:::warning
The `addNetwork` method is currently supported only by XVerse wallet. Other connectors may not implement this functionality yet.
:::

Adds a new network configuration to a connector. Throws if the connector is not found or does not support adding networks.


## Import

```ts
import { addNetwork } from "@midl/core";
```

## Example

```ts
import { addNetwork } from "@midl/core";

await addNetwork(config, "my-connector", {
  id: "testnet",
  name: "Testnet",
  rpcUrl: "https://...",
  // ...other network config fields
});
```

## Parameters

| Name          | Type                                                            | Description                                                  |
| ------------- | --------------------------------------------------------------- | ------------------------------------------------------------ |
| config        | [`Config`](../configuration.md#creating-a-configuration-object) | The configuration object                                     |
| connectorId   | `string`                                                        | The ID of the connector to which the network should be added |
| networkConfig | [`NetworkConfig`](../reference.md#networkconfig)                | The network configuration to add                             |

## Returns

`Promise<void>` – Resolves with the result of the connector's `addNetwork` method.


