# signIntention

> **signIntention**(`config`, `client`, `intention`, `intentions`, `options`): `Promise<SignedTransaction>`

Signs the intention with the given options. The intention is signed as a generic Bitcoin message.

## Import

```ts
import { signIntention } from "@midl/executor";
```

## Example

```ts
const signed = await signIntention(config, client, intention, intentions, { txId });
```

## Parameters

| Name         | Type                                            | Description                                                  |
| ------------ | ----------------------------------------------- | ------------------------------------------------------------ |
| `config`     | `Config`                                        | The configuration object.                                    |
| `client`     | `Client`                                        | EVM client or provider.                                      |
| `intention`  | `TransactionIntention`                          | The intention to sign.                                       |
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

`Promise<SignedTransaction>` — The signed EVM transaction object.

