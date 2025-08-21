# useUTXOs

Retrieves UTXOs for the specified address.

## Import

```ts
import { useUTXOs } from '@midl/react';
```

## Example

```tsx
function MyComponent() {
    const { utxos } = useUTXOs('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq');

    return (
        <div>
            {utxos?.map(utxo => (
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

## Parameters

| Name    | Type         | Description                                                    |
| ------- | ------------ | -------------------------------------------------------------- |
| address | string       | The Bitcoin address for which to retrieve UTXOs.               |
| config  | `Config`     | (optional) Custom config to override the default from context. |
| query   | QueryOptions | (optional) Query options for react-query.                      |

## Returns

| Name    | Type   | Description                                           |
| ------- | ------ | ----------------------------------------------------- |
| utxos   | UTXO[] | The list of UTXOs for the specified address.          |
| ...rest | object | Additional query state (e.g. isLoading, error, etc.). |