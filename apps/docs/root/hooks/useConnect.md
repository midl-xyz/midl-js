# useConnect

Connects to a wallet using the specified connector.

## Import

```ts
import { useConnect } from "@midl-xyz/midl-js-react";
```

## Example

```tsx
function Page() {
  const { connect, connectors } = useConnect();

  return (
    <div>
      {connectors.map(connector => (
        <button
          key={connector.name}
          onClick={() =>
            connect({
              id: connector.id,
            })
          }
        >
          {connector.name}
        </button>
      ))}
    </div>
  );
}
```
