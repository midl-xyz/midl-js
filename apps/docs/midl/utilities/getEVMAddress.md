# getEVMAddress

> **getEVMAddress**(`account`, `network`): `string`

Derives the EVM (Ethereum) address from a Bitcoin account and network.

## Usage

```ts
import { getEVMAddress } from '@midl/executor';

const evmAddress = getEVMAddress(account, network);
```

## Parameters

| Name    | Type           | Description                 |
| ------- | -------------- | --------------------------- |
| account | Account        | The Bitcoin account object. |
| network | BitcoinNetwork | The Bitcoin network.        |

## Returns

`Address` — The corresponding EVM address.
