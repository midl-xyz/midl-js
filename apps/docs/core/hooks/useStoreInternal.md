# useStoreInternal

Internal hook to access the Zustand store in the Midl context. Prefer `useStore` for public usage.

## Import

```ts
import { useStoreInternal } from "@midl/react";
```

## Example

```ts
const store = useStoreInternal();
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `customStore` | `MidlContextStore` (optional) | Custom store to override the default. |

## Returns

`MidlContextStore` — The Zustand store instance.
