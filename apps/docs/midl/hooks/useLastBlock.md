# useLastBlock

Retrieve last BTC block processed by the executor contract.

## Import

```ts
import { useLastBlock } from "@midl-xyz/midl-js-executor-react";
```

## Example

```tsx
const { lastBlock } = useLastBlock();
```

## Returns

| Name      | Type                    | Description               |
| --------- | ----------------------- | ------------------------- |
| lastBlock | `number` \| `undefined` | The last BTC block number |
