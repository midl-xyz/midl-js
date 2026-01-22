# useDefaultAccount

Returns the default BTC account using the same selection logic as `getDefaultAccount`.

## Import

```ts
import { useDefaultAccount } from "@midl/react";
```

## Example

```ts
const account = useDefaultAccount();
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `config` | `Config` (optional) | Custom configuration to override the default. |

## Returns

`Account | null` — The selected account, or `null` if unavailable.
