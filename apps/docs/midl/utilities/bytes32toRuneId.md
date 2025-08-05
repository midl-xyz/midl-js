# bytes32toRuneId

> **bytes32toRuneId**(`bytes32RuneId`): `string`

Decodes a 32-byte pointer value back to a rune ID string in the format `blockHeight:txIndex`.

## Usage

```ts
import { bytes32toRuneId } from '@midl/executor';

const runeId = bytes32toRuneId("0x0000000000000000000000000000000000000000000000000000303900000001"); // "12345:1"
```

## Parameters

| Name          | Type          | Description                            |
| ------------- | ------------- | -------------------------------------- |
| bytes32RuneId | `0x${string}` | The 32-byte pointer value (hex string) |

## Returns

`string` — The rune ID string, e.g., "12345:1".
