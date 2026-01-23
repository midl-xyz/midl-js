# useConfigInternal

Internal hook to access the current MIDL config. Prefer `useConfig` for public usage.

## Import

```ts
import { useConfigInternal } from "@midl/react";
```

## Example

```ts
const config = useConfigInternal();
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `customConfig` | `Config` (optional) | Custom configuration to override the default. |

## Returns

`Config` — The current config instance.
