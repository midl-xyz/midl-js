# useStore

Accesses the global state within the Midl context. 
Under the hood, it uses [`zustand's useStore`](https://zustand.docs.pmnd.rs/hooks/use-store) hook.





## Import

```ts
import { useStore } from '@midl-xyz/midl-js-react';
```

## Example

```tsx
const store = useStore();
```

### Extending MIDL Context interface

You can extend the MIDL context interface to include your own state.

```ts
declare module "@midl-xyz/midl-js-react" {
	type State = {
		user: {
            address: string;
        };
	};

	export interface MidlContextState extends State {}
}

```
