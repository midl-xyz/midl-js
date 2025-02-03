# Write Contract

## Example

```tsx
import {
  useAddTxIntention,
  useFinalizeTxIntentions,
} from "@midl-xyz/midl-js-executor-react";

function WriteContract() {
  const addTxIntention = useAddTxIntention();
  const { finalizeBTCTransaction, signIntention } = useFinalizeTxIntentions();

  const handleWriteContract = async () => {
    await addTxIntention(intention);
  };

  return <button onClick={handleWriteContract}>Write Contract</button>;
}
```
