# useERC20Rune

Retrieve the ERC20 address associated with a Rune.

## Import

```ts
import { useERC20Rune } from "@midl/executor-react";
```

## Example

```ts
const { erc20Address } = useERC20Rune("1:1");

console.log(erc20Address);
```

## Parameters

| Name          | Type                        | Description                                  |
| ------------- | --------------------------- | -------------------------------------------- |
| runeId        | `string`                    | The rune ID to get the ERC20 address of      |
| options       | `object`                    | The options for the request                  |
| options.query | `UseReadContractParameters` | The parameters for the read contract request |
