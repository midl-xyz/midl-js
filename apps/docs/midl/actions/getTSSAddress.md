# getTSSAddress

> **getTSSAddress**(`config`, `client`): `Promise<string>`

Returns the current TSS (multisig) Bitcoin address from the Executor's global params contract.

## Import

```ts
import { getTSSAddress } from "@midl/executor";
```

## Example

```ts
const tssAddress = await getTSSAddress(config, client);
```

## Parameters

| Name     | Type     | Description               |
| -------- | -------- | ------------------------- |
| `config` | `Config` | The configuration object. |
| `client` | `Client` | Viem's client instance.   |

## Returns

`Promise<string>` — The TSS multisig Bitcoin address.
