# useStore

Accesses the global state within the Midl context. Under the hood, it uses [`zustand's useStore`](https://zustand.docs.pmnd.rs/hooks/use-store) hook.

## Import

```ts
import { useStore } from '@midl/react';
```

## Example

```tsx
const store = useStore();
// or with a custom store
const store = useStore(customStore);
```

## Parameters

| Name        | Type             | Description                                                         |
| ----------- | ---------------- | ------------------------------------------------------------------- |
| customStore | MidlContextStore | (optional) Custom Zustand store instance to use instead of context. |

## Returns

| Type  | Description                                                                        |
| ----- | ---------------------------------------------------------------------------------- |
| Store | The Zustand store instance for the current context (or the provided custom store). |

## Extending MIDL Context interface

You can extend the MIDL context interface to include your own state.

```ts
declare module "@midl/react" {
	type State = {
        user: {
            address: string;
        };
	};

	export interface MidlContextState extends State {}
}
```
