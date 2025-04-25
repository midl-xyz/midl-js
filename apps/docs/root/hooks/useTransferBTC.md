# useTransferBTC

Transfers BTC 

## Import

```ts
import { useTransferBTC } from '@midl-xyz/midl-js-react';
```

## Example

```tsx
function MyComponent() {
    const {transferBTC} = useTransferBTC();

    return (
        <button onClick={() => transferBTC({
            transfers: [
                {
                    amount: 100000
                    receiver: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
                }
            ]
        })}>Transfer 0.1 BTC</button>
    );
}
```