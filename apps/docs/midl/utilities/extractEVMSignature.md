# extractEVMSignature

> **extractEVMSignature**(`message`, `signature`, `protocol`, `options`): `Promise<{ r: string; s: string; v: bigint; }>`

Extracts an EVM-compatible signature from a base64-encoded signature.

## Usage

```ts
import { extractEVMSignature } from '@midl/executor';

const result = await extractEVMSignature(
  message,
  signature,
  protocol,
  {
    addressType,
    publicKey,
  }
);
// result: { r, s, v }
```

## Parameters

| Name                | Type                  | Description                     |
| ------------------- | --------------------- | ------------------------------- |
| message             | `string`              | The message that was signed.    |
| signature           | `string`              | The base64-encoded signature.   |
| protocol            | `SignMessageProtocol` | The signature protocol used.    |
| options             | `object`              | Additional options.             |
| options.addressType | `AddressType`         | The address type of the signer. |
| options.publicKey   | `string`              | The public key of the signer.   |

## Returns

`Promise<{ r: string; s: string; v: bigint; }>` — The extracted EVM signature components.
