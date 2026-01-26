# useSignIntentions

Signs multiple transaction intentions.

## Import

```ts
import { useSignIntentions } from "@midl/executor-react";
```

## Example

```ts
const { signIntentions } = useSignIntentions();
signIntentions({ txId });
```

## Parameters

| Name               | Type                             | Description                                   |
| ------------------ | -------------------------------- | --------------------------------------------- |
| `config`           | `Config` (optional)              | Custom configuration to override the default. |
| `store`            | `MidlContextStore` (optional)    | Custom store to override the default.         |
| `mutation`         | `UseMutationOptions` (optional)  | Mutation options for React Query.             |
| `options.protocol` | `SignMessageProtocol` (optional) | Protocol to use for signing the intentions.   |
| `options.from`     | `string` (optional)              | BTC address used to sign the transactions.    |
| `options.nonce`    | `number` (optional)              | Starting nonce for the intentions.            |


## Returns

| Name                  | Type                                                                      | Description                                       |
| --------------------- | ------------------------------------------------------------------------- | ------------------------------------------------- |
| `signIntentions`      | `(variables: SignIntentionsVariables) => void`                            | Function to sign transaction intentions in batch. |
| `signIntentionsAsync` | `(variables: SignIntentionsVariables) => Promise<SignIntentionsResponse>` | Async function to sign intentions.                |
| `intentions`          | `TransactionIntention[] `                                                 | The current list of transaction intentions.       |
| `...rest`             | `object`                                                                  | Additional mutation state from React Query.       |

### SignIntentionsVariables

| Name         | Type                     | Description                                                |
| ------------ | ------------------------ | ---------------------------------------------------------- |
| `txId`       | `string`                 | Transaction hash of the BTC transaction.                   |
| `intentions` | `TransactionIntention[]` | Optional intentions to sign instead of those in the store. |


