# getCreate2RuneAddress

Derives the ERC20 address for a Rune using the Create2 scheme.

## Import

```ts
import { getCreate2RuneAddress } from "@midl/executor";
```

## Example

```ts
const erc20Address = getCreate2RuneAddress("840000:1");
```

## Parameters

| Name    | Type     | Description                                      |
| ------- | -------- | ------------------------------------------------ |
| `runeId` | `string` | The rune ID in the format `blockHeight:txIndex`. |

## Returns

`Address` — The derived ERC20 address.
