# useEVMChain

Gets the EVM chain associated with the current Bitcoin network.

## Import

```ts
import { useEVMChain } from "@midl-xyz/midl-js-executor-react";
```

## Example

```ts
const evmChain = useEVMChain();
if (evmChain) {
  console.log(`EVM Chain Name: ${evmChain.name}`);
}
```

## Parameters

| Name     | Type     | Description                                              |
| -------- | -------- | -------------------------------------------------------- |
| `config` | `Config` | (optional) Custom configuration to override the default. |
| `chain`  | `Chain`  | (optional) Custom EVM chain to override the default.     |

## Returns

| Name       | Type            | Description                                               |
| ---------- | --------------- | --------------------------------------------------------- |
| `evmChain` | `Chain \| null` | The EVM chain configuration if available, otherwise null. |
