# getBTCAddressByte

> **getBTCAddressByte**(`account`): `bigint`

Returns a byte value derived from the public key of a Bitcoin account, depending on its address type.

- For P2SH(P2WPKH) addresses, adds 2 to the first byte of the public key.
- For P2WPKH addresses, returns the first byte of the public key.
- For P2TR addresses, returns 0n.

## Usage

```ts
import { getBTCAddressByte } from '@midl/executor';

const byteValue = getBTCAddressByte(account);
```

## Parameters

| Name    | Type      | Description         |
| ------- | --------- | ------------------- |
| account | `Account` | The Bitcoin account |

## Returns

`bigint` — The derived byte value.
