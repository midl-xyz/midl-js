# useEVMAddress

Gets the EVM address from a public key.
If no public key is provided, it uses the connected payment or ordinals account's public key.

## Import

```ts
import { useEVMAddress } from "@midl-xyz/midl-js-executor-react";
```

## Example

```ts
const evmAddress = useEVMAddress({ publicKey: "0xabc123..." });
console.log(evmAddress);
```

## Parameters

| Name   | Type                                          | Description                    |
| ------ | --------------------------------------------- | ------------------------------ |
| params | [`UseEVMAddressParams`](#useevmaddressparams) | The parameters for the request |

### UseEVMAddressParams

| Name      | Type     | Description                                |
| --------- | -------- | ------------------------------------------ |
| publicKey | `string` | The public key to get the EVM address from |

## Returns

`string` - The EVM address
