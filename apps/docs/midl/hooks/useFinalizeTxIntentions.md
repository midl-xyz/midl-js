# useFinalizeTxIntentions

Prepares BTC transaction for the intentions. Finalizes the transaction and signs the intentions.
Calculates gas limits for EVM transactions, total fees and transfers.

## Import

```ts
import { useFinalizeTxIntentions } from "@midl-xyz/midl-js-executor-react";
```

## Example

```tsx
const {
  btcTransaction,
  finalizeBTCTransaction,
  signIntention,
  isSuccess: isFinalizedBTC,
  isPending: isFinalizingBTC,
  signIntentionState,
  isError,
  error,
} = useFinalizeTxIntentions();

// To finalize a BTC transaction
finalizeBTCTransaction({
  stateOverride,
  feeRateMultiplier,
});

// To sign a specific transaction intention
signIntention(transactionIntention);
```
