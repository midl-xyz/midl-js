# createStore

Creates a Midl context store using Zustand. Useful for advanced integrations where you need a custom store instance.

## Import

```ts
import { createStore } from "@midl/react";
```

## Example

```ts
import { createStore } from "@midl/react";

const store = createStore({
  intentions: [],
});
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `initialState` | `MidlContextState` | Initial store state. |

## Returns

`StoreApi<MidlContextState>` — Zustand store instance.
