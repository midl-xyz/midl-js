# useLastNonce

Retrieves the last nonce for the current account. Combines the on-chain transaction count with the local store's nonce to determine the current nonce used for signing transactions.

## Import

```ts
import { useLastNonce } from "@midl-xyz/midl-js-executor-react";
```

## Example

```ts
const lastNonce = useLastNonce();
console.log(`Last nonce: ${lastNonce}`);
```

## Parameters

| Name    | Type                          | Description                           |
| ------- | ----------------------------- | ------------------------------------- |
| `store` | `MidlContextStore` (optional) | Custom store to override the default. |

## Returns

| Name        | Type     | Description                                                          |
| ----------- | -------- | -------------------------------------------------------------------- |
| `lastNonce` | `number` | The last nonce value for the current account, or 0 if not available. |
