# useWaitForTransaction

Waits for a transaction to be confirmed

## Import

```ts
import { useWaitForTransaction } from '@midl-xyz/midl-js-react';
```

## Example

```tsx
function MyComponent() {
    const {waitForTransaction, data} = useWaitForTransaction();

    return (
        <div>
            <button onClick={() => waitForTransaction({txId: 'f5b1a7d749f4f3e7b3f3e1e4d...' })}>Wait for transaction</button>
            
            <p>Confirmations: {data}</p>
        </div>
    );
}
```