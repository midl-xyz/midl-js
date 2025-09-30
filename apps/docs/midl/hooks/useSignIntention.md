# useSignIntention

Signs a transaction intention.

## Import

```ts
import { useSignIntention } from "@midl/executor-react";
```

## Example

```ts
const { signIntention } = useSignIntention();
signIntention({ intention, txId });
```

## Parameters

| Name               | Type                             | Description                                   |
| ------------------ | -------------------------------- | --------------------------------------------- |
| `config`           | `Config` (optional)              | Custom configuration to override the default. |
| `store`            | `MidlContextStore` (optional)    | Custom store to override the default.         |
| `mutation`         | `UseMutationOptions` (optional)  | Mutation options for React Query.             |
| `options.protocol` | `SignMessageProtocol` (optional) | Protocol to use for signing the intention.    |
| `options.from`     | `string` (optional)              | BTC address used to sign the transactions.    |
| `options.nonce`    | `number` (optional)              | Starting nonce for the intentions.            |


## Returns

| Name                 | Type                                                                    | Description                                        |
| -------------------- | ----------------------------------------------------------------------- | -------------------------------------------------- |
| `signIntention`      | `(variables: SignIntentionVariables) => void`                           | Function to sign a specific transaction intention. |
| `signIntentionAsync` | `(variables: SignIntentionVariables) => Promise<SignIntentionResponse>` | Async function to sign an intention.               |
| `intentions`         | `TransactionIntention[] `                                               | The current list of transaction intentions.        |
| `...rest`            | `object`                                                                | Additional mutation state from React Query.        |

### SignIntentionVariables

| Name        | Type                   | Description                               |
| ----------- | ---------------------- | ----------------------------------------- |
| `intention` | `TransactionIntention` | The intention to sign.                    |
| `txId`      | `string`               | Transaction hash of the BTC transaction . |
