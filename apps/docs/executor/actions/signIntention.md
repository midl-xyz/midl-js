# signIntention

> **signIntention**(`config`, `store`,`client`, `intention`, `options`): `Promise`\<`0x{string}`\>

Signs the intention with the given options. The intentions is signed as generic Bitcoin message.

## Import

```ts
import { signIntention } from "@midl-xyz/midl-js-executor";
```

## Example

```ts
const signedIntention = await signIntention(
  config,
  store,
  client,
  intention,
  options
);
console.log(signedIntention);
```

## Parameters

| Name      | Type                                                                       | Description                |
| --------- | -------------------------------------------------------------------------- | -------------------------- |
| config    | [`Config`](../../bitcoin/configuration.md#creating-a-configuration-object) | The configuration object   |
| store     | `Store`                                                                    | The store object           |
| client    | `Client` \| 'Provider'                                                     | The EVM client or provider |
| intention | `Intention`                                                                | The intention to sign      |
| options   | [`SignIntentionOptions`](#signintentionoptions)                            | The options for signing    |

### SignIntentionOptions

| Name       | Type                                                                                    | Description                                                                                       |
| ---------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| publicKey? | `string`                                                                                | Public key of the account to use for signing                                                      |
| nonce?     | `number`                                                                                | Next nonce of registered in EVM network, nonce is incremented by 1 for each transaction intention |
| gasPrice?  | `bigint`                                                                                | Gas price for EVM transactions                                                                    |
| txId       | `string`                                                                                | Transaction hash of the BTC transaction                                                           |
| protocol?  | [`SignMessageProtocol`](../../bitcoin/actions//signMessage.md#signmessageprotocol-enum) | Protocol for signing the message (optional)                                                       |
