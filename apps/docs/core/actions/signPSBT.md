# signPSBT

> **signPSBT**(`config`, `params`): `Promise`\<[`SignPSBTResponse`](#signpsbtresponse)\>

Signs a PSBT with the given parameters. Optionally, it can broadcast the transaction.

## Import

```ts
import { signPSBT } from "@midl/core";
```

## Example

```ts
const signedPSBT = await signPSBT(config, {
  psbt: "cHNidP8BAHECAAAA...",
  signInputs: {
    "02c6047f9441ed7d6d3045406e95c07cd85a4697e2e6e5d1b1e7e6e5d1b1e7e6": [0],
  },
  publish: true,
});

console.log(signedPSBT);
```

## Parameters

| Name   | Type                                                            | Description                    |
| ------ | --------------------------------------------------------------- | ------------------------------ |
| config | [`Config`](../configuration.md#creating-a-configuration-object) | The configuration object       |
| params | [`SignPSBTParams`](#signpsbtparams)                             | The parameters for the request |

### SignPSBTParams

| Name                | Type                       | Description                                                                       |
| ------------------- | -------------------------- | --------------------------------------------------------------------------------- |
| psbt                | `string`                   | Base64 encoded PSBT to sign                                                       |
| signInputs          | `Record<string, number[]>` | The inputs to sign, in the format `{ address: [inputIndex] }`                     |
| publish?            | `boolean`                  | If true, the transaction will be broadcasted (optional)                           |
| disableTweakSigner? | `boolean`                  | If true, tweaking the signer will be disabled for supported connectors (optional) |

## Returns

`Promise`\<[`SignPSBTResponse`](#signpsbtresponse)\>

The signed PSBT

### SignPSBTResponse

| Name  | Type     | Description                                            |
| ----- | -------- | ------------------------------------------------------ |
| psbt  | `string` | Signed Base64 encoded PSBT                             |
| txId? | `string` | The transaction ID, if the transaction was broadcasted |
