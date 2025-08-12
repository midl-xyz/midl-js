# useClearTxIntentions

Clears all transaction intentions from the store.

## Import

```ts
import { useClearTxIntentions } from "@midl-xyz/midl-js-executor-react";
```

## Example

```ts
const clearIntentions = useClearTxIntentions();
clearIntentions();
```

## Parameters

| Name    | Type                        | Description                           |
| ------- | --------------------------- | ------------------------------------- |
| `store` | MidlContextStore (optional) | Custom store to override the default. |

## Returns

| Name              | Type     | Description                                   |
| ----------------- | -------- | --------------------------------------------- |
| `clearIntentions` | function | Function to clear all transaction intentions. |
