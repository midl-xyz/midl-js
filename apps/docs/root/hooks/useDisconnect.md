# useDisconnect

Disconnects the app from the wallet.

## Import

```ts
import { useDisconnect } from "@midl-xyz/midl-js-react";
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
