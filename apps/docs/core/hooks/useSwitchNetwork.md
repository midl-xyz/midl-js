# useSwitchNetwork

Switches between different Bitcoin networks as configured.

## Import

```ts
import { useSwitchNetwork } from '@midl/react';
```

## Example

```tsx
import { mainnet, testnet } from '@midl/core';

function MyComponent() {
    const { switchNetwork } = useSwitchNetwork();

    return (
        <button onClick={() => switchNetwork(mainnet)}>Switch to Mainnet</button>
    );
}
```

## Parameters

| Name     | Type                 | Description                                                    |
| -------- | -------------------- | -------------------------------------------------------------- |
| mutation | `UseMutationOptions` | (optional) Mutation options for react-query.                   |
| config   | `Config`             | (optional) Custom config to override the default from context. |

### SwitchNetworkVariables

| Type             | Description               |
| ---------------- | ------------------------- |
| `BitcoinNetwork` | The network to switch to. |

## Returns

| Name               | Type                                                   | Description                                              |
| ------------------ | ------------------------------------------------------ | -------------------------------------------------------- |
| switchNetwork      | `(variables: SwitchNetworkVariables) => void`          | Function to initiate a network switch.                   |
| switchNetworkAsync | `(variables: SwitchNetworkVariables) => Promise<void>` | Function to asynchronously switch networks.              |
| networks           | `Array<BitcoinNetwork>`                                | The list of available Bitcoin networks.                  |
| ...rest            | object                                                 | Additional mutation state (e.g. isLoading, error, etc.). |


