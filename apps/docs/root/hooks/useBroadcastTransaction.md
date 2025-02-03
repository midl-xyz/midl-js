# useBroadcastTransaction

Broadcasts a transaction to the Bitcoin network.

## Import

```ts
import { useBroadcastTransaction } from "@midl-xyz/midl-js-react";
```

## Example

```tsx
function Page() {
  const { broadcastTransaction, isPending } = useBroadcastTransaction();

  const tx = "01000000000101...";

  const onBroadcast = async () => {
    broadcastTransaction({ tx });
  };

  return (
    <div>
      <button onClick={onBroadcast} disabled={isPending}>
        {isBroadcasting ? "Broadcasting..." : "Broadcast"}
      </button>
    </div>
  );
}
```

## Parameters

| Name            | Type                            | Description          |
| --------------- | ------------------------------- | -------------------- |
| params          | `UseBroadcastTransactionParams` | The hook params      |
| params.mutation | `UseMutationOptions`            | The mutation options |

## Returns

| Name                      | Type                                                                                    | Description                        |
| ------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------- |
| broadcastTransaction      | `(variables: UseBroadcastTransactionVariables) => void`                                 | The broadcast transaction function |
| broadcastTransactionAsync | `(variables: UseBroadcastTransactionVariables) => Promise<UseBroadcastTransactionData>` | The broadcast transaction function |
| data                      | `UseBroadcastTransactionData`                                                           | The broadcast transaction data     |
| ...rest                   | `object`                                                                                | Additional mutation state          |

### UseBroadcastTransactionVariables

| Name | Type     | Description          |
| ---- | -------- | -------------------- |
| tx   | `string` | The transaction data |

### UseBroadcastTransactionData

`string` - The transaction ID
