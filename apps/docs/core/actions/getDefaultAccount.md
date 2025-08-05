# getDefaultAccount

> **getDefaultAccount**(`config`, `predicate?`): `Account`

Gets the default account from the current connection.

The selection order is:
1. If a predicate is provided, returns the first account matching the predicate.
2. If a defaultPurpose is set, returns the first account with that purpose.
3. Otherwise, returns the first account with the purpose of `Payment`, or if not found, `Ordinals`.

## Import

```ts
import { getDefaultAccount } from "@midl-xyz/midl-js-core";
```

## Example

```ts
import { getDefaultAccount } from "@midl-xyz/midl-js-core";

const account = getDefaultAccount(config, acc => acc.address === 'bcrt1q...');
console.log(account);
```

## Parameters

| Name       | Type                                                            | Description                                            |
| ---------- | --------------------------------------------------------------- | ------------------------------------------------------ |
| config     | [`Config`](../configuration.md#creating-a-configuration-object) | The configuration object                               |
| predicate? | `(account: Account) => boolean`                                 | (Optional) A function to search for a specific account |

## Returns

`Account` – The selected account.

## Errors

Throws `WalletConnectionError` if there is no active connection.  
Throws `EmptyAccountsError` if there are no accounts.  
Throws `PredicateError` if a predicate is provided and no account matches.
