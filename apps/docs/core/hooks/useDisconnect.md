# useDisconnect

Disconnects the app from the wallet.

## Import

```ts
import { useDisconnect } from "@midl/react";
```

## Example

```tsx
function Page() {
  const { disconnect } = useDisconnect();

  return (
    <div>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
}
```

## Parameters

| Name     | Type                 | Description                                                    |
| -------- | -------------------- | -------------------------------------------------------------- |
| mutation | `UseMutationOptions` | (optional) Mutation options for react-query.                   |
| config   | `Config`             | (optional) Custom config to override the default from context. |

## Returns

| Name            | Type                  | Description                                              |
| --------------- | --------------------- | -------------------------------------------------------- |
| disconnect      | `() => void`          | Function to initiate disconnection.                      |
| disconnectAsync | `() => Promise<void>` | Function to asynchronously disconnect.                   |
| ...rest         | object                | Additional mutation state (e.g. isLoading, error, etc.). |

