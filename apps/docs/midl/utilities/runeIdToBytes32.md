# runeIdToBytes32

> **runeIdToBytes32**(`runeId`): `Address`

Converts a rune ID string (in the format `blockHeight:txIndex`) to a 32-byte pointer value.

The rune ID is encoded by combining the block height and transaction index, then padding the result to 32 bytes.

## Usage

```ts
import { runeIdToBytes32 } from '@midl/executor';

const pointer = runeIdToBytes32("12345:1");
```

## Parameters

| Name   | Type   | Description                         |
| ------ | ------ | ----------------------------------- |
| runeId | string | The rune ID string, e.g., "12345:1" |

## Returns

`Address` — The 32-byte pointer representation of the rune ID.
