# signIntentions

> **signIntentions**(`config`, `client`, `intentions`, `options`): `Promise<SignedTransaction[]>`

Signs multiple intentions with the given options. Each intention is signed as a generic Bitcoin message.

## Import

```ts
import { signIntentions } from "@midl/executor";
```

## Example

```ts
const signed = await signIntentions(config, client, intentions, { txId });
```

## Parameters

| Name         | Type                                            | Description                                                  |
| ------------ | ----------------------------------------------- | ------------------------------------------------------------ |
| `config`     | `Config`                                        | The configuration object.                                    |
| `client`     | `Client`                                        | EVM client or provider.                                      |
| `intentions` | `TransactionIntention[]`                        | The list of intentions to sign (used for nonce calculation). |
| `options`    | [`SignIntentionOptions`](#signintentionoptions) | The options for signing.                                     |

### SignIntentionOptions

| Name       | Type                           | Description                                    |
| ---------- | ------------------------------ | ---------------------------------------------- |
| `from`     | string (optional)              | BTC address of the account to use for signing. |
| `nonce`    | number (optional)              | Next nonce registered in EVM network.          |
| `txId`     | string                         | Transaction hash of the BTC transaction.       |
| `protocol` | SignMessageProtocol (optional) | Protocol for signing the message.              |

## Returns

`Promise<SignedTransaction[]>` — The signed EVM transactions.


