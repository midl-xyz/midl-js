# useSignMessages

Signs multiple messages in a single request. Supports ECDSA and BIP322 protocols.

:::warning
`signMessages` is currently supported only by the Xverse connector. If the active connector does not support `signMessages`, the core implementation falls back to signing each message individually using `signMessage`.
:::

If `address` is not provided for a message, the default account address will be used. If `protocol` is not provided, BIP322 will be used by default.

## Import

```ts
import { useSignMessages } from "@midl/react";
```

## Example

```tsx
function SignMessages() {
  const { signMessages, isLoading, error, data } = useSignMessages();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <p>{data?.[0]?.signature}</p>
      <button
        onClick={() =>
          signMessages([
            { message: "Hello, world!" },
            { message: "Second message" },
          ])
        }
      >
        Sign Messages
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

### SignMessagesVariables

An array of [`SignMessageParams`](../actions/signMessage.md#signmessageparams), with `address` optional per message.

| Name     | Type   | Description                                                                 |
| -------- | ------ | --------------------------------------------------------------------------- |
| message  | string | The message to sign.                                                        |
| address  | string | (optional) The address to sign with. If not provided, uses default account. |
| protocol | string | (optional) The protocol to use (ECDSA or BIP322). Defaults to BIP322.       |

## Returns

| Name              | Type                                                              | Description                                              |
| ----------------- | ----------------------------------------------------------------- | -------------------------------------------------------- |
| signMessages      | `(variables: SignMessagesVariables) => void`                      | Function to initiate message signing.                    |
| signMessagesAsync | `(variables: SignMessagesVariables) => Promise<SignMessagesData>` | Function to asynchronously sign the messages.            |
| ...rest           | object                                                            | Additional mutation state (e.g. isLoading, error, etc.). |
