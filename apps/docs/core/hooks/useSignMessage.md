# useSignMessage

Signs a message with the given address and message. Supports ECDSA and BIP322 protocols.

If `address` is not provided, the default account address will be used. If `protocol` is not provided, BIP322 will be used by default.

## Import

```ts
import { useSignMessage } from "@midl/react";
```

## Example

```tsx
function SignMessage() {
  const { signMessage, isLoading, error, data } = useSignMessage();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <p>{data?.signature}</p>
      <button
        onClick={() =>
          signMessage({ message: "Hello, world!" })
        }
      >
        Sign Message
      </button>
    </div>
  );
}
```

## Parameters

| Name     | Type               | Description                                                    |
| -------- | ------------------ | -------------------------------------------------------------- |
| mutation | UseMutationOptions | (optional) Mutation options for react-query.                   |
| config   | `Config`           | (optional) Custom config to override the default from context. |

### SignMessageVariables

| Name     | Type   | Description                                                                 |
| -------- | ------ | --------------------------------------------------------------------------- |
| message  | string | The message to sign.                                                        |
| address  | string | (optional) The address to sign with. If not provided, uses default account. |
| protocol | string | (optional) The protocol to use (ECDSA or BIP322). Defaults to BIP322.       |

## Returns

| Name             | Type                                                            | Description                                              |
| ---------------- | --------------------------------------------------------------- | -------------------------------------------------------- |
| signMessage      | `(variables: SignMessageVariables) => void`                     | Function to initiate message signing.                    |
| signMessageAsync | `(variables: SignMessageVariables) => Promise<SignMessageData>` | Function to asynchronously sign the message.             |
| ...rest          | object                                                          | Additional mutation state (e.g. isLoading, error, etc.). |
