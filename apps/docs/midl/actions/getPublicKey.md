# getPublicKey

> **getPublicKey**(`account`, `network`): `0x${string} | null`

Returns the public key to use for passing along to the EVM network.

## Import

```ts
import { getPublicKey } from "@midl-xyz/midl-js-executor";
```

## Example

```ts
const pubkey = getPublicKey(account, network);
```

## Parameters

| Name      | Type             | Description          |
| --------- | ---------------- | -------------------- |
| `account` | `Account`        | The account object.  |
| `network` | `BitcoinNetwork` | The Bitcoin network. |

## Returns

`0x${string} | null` — The public key as a hex string prefixed with 0x, or null if not supported.

## Notes
- For P2TR addresses, returns the hex-encoded x-only public key (after removing the first two bytes from the output).
- For P2WPKH and P2SH(P2WPKH), returns the hex-encoded x-coordinate of the public key.
