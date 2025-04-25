# useSignMessage

Signs a message with the given address and message.
Supports ECDSA and BIP322 protocols

## Import

```ts
import { useSignMessage } from "@midl-xyz/midl-js-react";
```

## Example

```tsx
function SignMessage() {
  const { data, signMessage, error, loading } = useSignMessage();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <p>{data.signature}</p>
      <button
        onClick={() =>
          signMessage({ address: "bc1q...", message: "Hello, world!" })
        }
      >
        Sign Message
      </button>
    </div>
  );
}
```
