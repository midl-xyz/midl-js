# useTransferBTC

Creates a Bitcoin transaction to transfer BTC to one or more recipients using the configured wallet. The transaction will only be broadcast if `publish` is set to `true` in the parameters.

## Import

```ts
import { useTransferBTC } from '@midl-xyz/midl-js-react';
```

## Example

```tsx
function MyComponent() {
    const { transferBTC } = useTransferBTC();

    return (
        <button onClick={() => transferBTC({
            transfers: [
                {
                    amount: 100000,
                    receiver: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
                }
            ],
            publish: true // Set to true to broadcast the transaction
        })}>Transfer 0.1 BTC</button>
    );
}
```

## Parameters

| Name     | Type                 | Description                                                    |
| -------- | -------------------- | -------------------------------------------------------------- |
| mutation | `UseMutationOptions` | (optional) Mutation options for react-query.                   |
| config   | `Config`             | (optional) Custom config to override the default from context. |

### TransferBTCVariables

See [`TransferBTCParams`](../actions/transferBTC.md#transferbtcparams) for the full list of parameters.

## Returns

| Name             | Type                                                            | Description                                              |
| ---------------- | --------------------------------------------------------------- | -------------------------------------------------------- |
| transferBTC      | `(variables: TransferBTCVariables) => void`                     | Function to initiate a BTC transfer.                     |
| transferBTCAsync | `(variables: TransferBTCVariables) => Promise<TransferBTCData>` | Function to asynchronously transfer BTC.                 |
| ...rest          | object                                                          | Additional mutation state (e.g. isLoading, error, etc.). |