# useAddTxIntention

Adds a new transaction intention to the store.

## Import

```ts
import { useAddTxIntention } from "@midl-xyz/midl-js-executor-react";
```

## Example

```ts
const { addTxIntention } = useAddTxIntention();

addTxIntention({
  intention,
  reset,
  publicKey,
});
```
