# signTransaction

> **signTransaction**(`config`, `tx`, `client`, `options?`): `Promise<string>`

Signs an EVM transaction using the provided configuration and options.

## Import

```ts
import { signTransaction } from "@midl/executor";
```

## Example

```ts
const signedTx = await signTransaction(config, tx, client, { from, protocol });
```

## Parameters

| Name      | Type                                                           | Description                          |
| --------- | -------------------------------------------------------------- | ------------------------------------ |
| `config`  | `Config`                                                       | The configuration object.            |
| `tx`      | `TransactionSerializableBTC`                                   | The transaction to sign.             |
| `client`  | `Client`                                                       | EVM client or provider.              |
| `options` | [`SignTransactionOptions`](#signtransactionoptions) (optional) | Options for signing the transaction. |

### SignTransactionOptions

| Name       | Type                           | Description                                    |
| ---------- | ------------------------------ | ---------------------------------------------- |
| `from`     | string (optional)              | BTC address of the account to use for signing. |
| `nonce`    | number (optional)              | Nonce to use for the transaction.              |
| `protocol` | SignMessageProtocol (optional) | Protocol for signing the message.              |

## Returns

`Promise<string>` — The signed and serialized transaction as a hex string.

