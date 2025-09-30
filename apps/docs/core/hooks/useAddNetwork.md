# useAddNetwork

Adds a new network configuration to a connector.

:::warning
The `addNetwork` method is currently supported only by XVerse wallet. Other connectors may not implement this functionality yet.
:::

## Import

```ts
import { useAddNetwork } from "@midl/react";
```

## Example

```ts
const { addNetwork, addNetworkAsync } = useAddNetwork();
addNetwork({ connectorId: 'my-connector', networkConfig: { id: 'testnet', name: 'Testnet', rpcUrl: 'https://...' } });
```

## Parameters

| Name     | Type                 | Description                                                      |
| -------- | -------------------- | ---------------------------------------------------------------- |
| config   | `Config`             | (optional) Config object to use instead of the one from context. |
| mutation | `UseMutationOptions` | (optional) Mutation options for react-query.                     |

## Returns

| Name            | Type                                                   | Description                                 |
| --------------- | ------------------------------------------------------ | ------------------------------------------- |
| addNetwork      | `(variables: UseAddNetworkVariables) => void`          | Function to initiate adding a network.      |
| addNetworkAsync | `(variables: UseAddNetworkVariables) => Promise<void>` | Function to asynchronously add a network.   |
| ...rest         | object                                                 | Additional mutation state from useMutation. |

### UseAddNetworkVariables

| Name          | Type                                             | Description               |
| ------------- | ------------------------------------------------ | ------------------------- |
| connectorId   | string                                           | The connector ID          |
| networkConfig | [`NetworkConfig`](../reference.md#networkconfig) | The network configuration |


