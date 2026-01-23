# signMessages

> **signMessages**(`config`, `messages`): `Promise`\<[`SignMessageResponse`](#signmessageresponse)[]\>

Signs multiple messages in a single request.
Supports ECDSA and BIP322 protocols.

:::warning
`signMessages` is currently supported only by the Xverse connector. If the active connector does not support `signMessages`, the core implementation falls back to signing each message individually using `signMessage`.
:::

## Import

```ts
import { signMessages } from "@midl/core";
```

## Example

```ts
const signatures = await signMessages(config, [
  { address: "bc1q...", message: "Hello, world!" },
  { address: "bc1q...", message: "Second message" },
]);

console.log(signatures);
```

## Parameters

| Name     | Type                                                            | Description                 |
| -------- | --------------------------------------------------------------- | --------------------------- |
| config   | [`Config`](../configuration.md#creating-a-configuration-object) | The configuration object    |
| messages | [`SignMessageParams`](#signmessageparams)[]                     | The messages to sign        |

### SignMessageParams

| Name     | Type                                               | Description                                |
| -------- | -------------------------------------------------- | ------------------------------------------ |
| address  | `string`                                           | The address to sign the message with       |
| message  | `string`                                           | The message to sign                        |
| protocol | [`SignMessageProtocol`](#signmessageprotocol-enum) | The protocol to use for signing (optional) |

### SignMessageProtocol (enum)

| Name     | Value    |
| -------- | -------- |
| `Ecdsa`  | "ECDSA"  |
| `Bip322` | "BIP322" |

## Returns

`Promise`\<[`SignMessageResponse`](#signmessageresponse)[]\>

The signature responses

### SignMessageResponse

| Name         | Type     | Description                           |
| ------------ | -------- | ------------------------------------- |
| signature    | `string` | Base64 encoded signature              |
| address      | `string` | The address that signed the message   |
| protocol     | `string` | The protocol used to sign the message |
| messageHash? | `string` | The message hash                      |
