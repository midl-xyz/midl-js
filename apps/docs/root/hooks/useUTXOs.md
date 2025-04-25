# useUTXOs

Retrieves UTXOs for the specified address.

## Import

```ts
import { useUTXOs } from '@midl-xyz/midl-js-react';
```

## Example

```tsx
function MyComponent() {
    const {utxos} = useUTXOs('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq');

    return (
        <div>
            {utxos.map(utxo => (
                <div key={utxo.txid}>
                    <p>TXID: {utxo.txid}</p>
                    <p>Vout: {utxo.vout}</p>
                    <p>Amount: {utxo.value}</p>
                </div>
            ))}
        </div>
    );
}
```