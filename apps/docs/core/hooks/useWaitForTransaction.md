# useWaitForTransaction

Waits for a transaction to be confirmed. You can specify the number of confirmations, max attempts, and polling interval.

## Import

```ts
import { useWaitForTransaction } from '@midl/react';
```

## Example

```tsx
function MyComponent() {
    const { waitForTransaction, data } = useWaitForTransaction();

    return (
        <div>
            <button onClick={() => waitForTransaction({ txId: 'f5b1a7d749f4f3e7b3f3e1e4d...', confirmations: 3 })}>
                Wait for transaction
            </button>
            <p>Confirmations: {data}</p>
        </div>
    );
}
```

## Parameters

| Name     | Type                 | Description                                                    |
| -------- | -------------------- | -------------------------------------------------------------- |
| mutation | `UseMutationOptions` | (optional) Mutation options for react-query.                   |
| config   | `Config`             | (optional) Custom config to override the default from context. |

### WaitForTransactionVariables

| Name          | Type   | Description                                                           |
| ------------- | ------ | --------------------------------------------------------------------- |
| txId          | string | The transaction ID to wait for.                                       |
| confirmations | number | (optional) Number of confirmations to wait for (default: 1).          |
| maxAttempts   | number | (optional) Maximum number of attempts to check for confirmation.      |
| intervalMs    | number | (optional) Interval in ms between attempts to check for confirmation. |

## Returns

| Name                    | Type                                                          | Description                                              |
| ----------------------- | ------------------------------------------------------------- | -------------------------------------------------------- |
| waitForTransaction      | `(variables: WaitForTransactionVariables) => void`            | Function to initiate waiting for a transaction.          |
| waitForTransactionAsync | `(variables: WaitForTransactionVariables) => Promise<number>` | Function to asynchronously wait for a transaction.       |
| ...rest                 | object                                                        | Additional mutation state (e.g. isLoading, error, etc.). |