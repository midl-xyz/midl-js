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
