# useEVMAddress

Gets the EVM address from a public key. If no public key is provided, it uses the connected payment or ordinals account's public key.

## Import

```ts
import { useEVMAddress } from "@midl-xyz/midl-js-executor-react";
```

## Example

```ts
const evmAddress = useEVMAddress({ from: 'bcrt...' });
```

## Parameters

| Name     | Type     | Description                                                        |
| -------- | -------- | ------------------------------------------------------------------ |
| `from`   | `string` | (optional) BTC address of the account to get the EVM address from. |
| `config` | `Config` | (optional) Custom configuration to override the default.           |

## Returns

| Name         | Type     | Description                                                     |
| ------------ | -------- | --------------------------------------------------------------- |
| `evmAddress` | `string` | The EVM address as a string (or zero address if not available). |
