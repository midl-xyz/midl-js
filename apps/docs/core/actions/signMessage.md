# signMessage

> **signMessage**(`config`, `params`): `Promise`\<[`SignMessageResponse`](#signmessageresponse)\>

Signs a message with the given address and message.
Supports ECDSA and BIP322 protocols

## Import

```ts
import { signMessage } from "@midl/core";
```

## Example

```ts
const signature = await signMessage(config, {
  address: "bc1q...",
  message: "Hello, world!",
});

console.log(signature);
```

## Parameters

| Name   | Type                                                            | Description                    |
| ------ | --------------------------------------------------------------- | ------------------------------ |
| config | [`Config`](../configuration.md#creating-a-configuration-object) | The configuration object       |
| params | [`SignMessageParams`](#signmessageparams)                       | The parameters for the request |

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

`Promise`\<[`SignMessageResponse`](#signmessageresponse)\>

The signature response

### SignMessageResponse

| Name         | Type     | Description                           |
| ------------ | -------- | ------------------------------------- |
| signature    | `string` | Base64 encoded signature              |
| address      | `string` | The address that signed the message   |
| protocol     | `string` | The protocol used to sign the message |
| messageHash? | `string` | The message hash                      |
