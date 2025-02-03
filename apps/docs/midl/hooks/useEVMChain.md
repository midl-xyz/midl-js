# useEVMChain

Gets the EVM chain associated with the current Bitcoin network.

## Import

```ts
import { useEVMChain } from "@midl-xyz/midl-js-executor-react";
```

## Example

```tsx
const evmChain = useEVMChain();
if (evmChain) {
  console.log(`EVM Chain Name: ${evmChain.name}`);
}
```

## Returns

`Chain` | `null` - The EVM chain configuration if available, otherwise `null`.
