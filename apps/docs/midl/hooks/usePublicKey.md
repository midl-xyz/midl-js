# usePublicKey

Returns the public key to use for passing along to the EVM network.

For `P2TR` addresses, returns the hex-encoded x-only public key (after removing the first two bytes from the output). For `P2WPKH` and `P2SH(P2WPKH)`, returns the hex-encoded x-coordinate of the public key.

## Import

```ts
import { usePublicKey } from "@midl-xyz/midl-js-executor-react";
```

## Example

```ts
const publicKeyHex = usePublicKey({ from: 'bcrtq...' });
```

## Parameters

| Name     | Type                | Description                                                |
| -------- | ------------------- | ---------------------------------------------------------- |
| `from`   | `string` (optional) | The BTC address of the account to get the public key from. |
| `config` | `Config` (optional) | Custom configuration to override the default.              |

## Returns

| Name        | Type             | Description                                               |
| ----------- | ---------------- | --------------------------------------------------------- |
| `publicKey` | `string \| null` | The public key as a hex string, or null if not available. |
