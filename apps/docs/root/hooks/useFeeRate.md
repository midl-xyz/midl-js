# useFeeRate

Gets the current fee rate

## Import

```ts
import { useFeeRate } from "@midl-xyz/midl-js-react";
```

## Example

```tsx
function FeeRate() {
  const { feeRate, isLoading, error } = useFeeRate();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Fee Rate: {feeRate}</div>;
}
```
