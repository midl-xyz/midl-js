---
title: Add a Rune
order: 1
---

# Add a Rune

This guide covers the primary path for adding a Rune to MIDL.

## Prerequisites
- A configured MIDL app (see [Getting Started](../../getting-started.md)).
- A connected wallet with the Rune UTXO you want to deposit.

## Add a Rune by depositing it in an intention

Deposit the Rune in any intention (for example, when writing to a contract). Any Rune deposit creates the mapping automatically.

```ts
import { addTxIntention } from "@midl/executor";

const intention = await addTxIntention(config, {
  evmTransaction: {
    to: "0xYourContract",
    data: "0x...",
  },
  deposit: {
    runes: [{ id: "840000:1", amount: 1n }],
  },
});
```

This is the usual path. MIDL automatically creates the ERC20 contract for the Rune when it sees the deposit.
You can batch it with other intentions before finalizing and signing.

## After adding a Rune

Once a Rune is added, you can query its ERC20 address or reverse-lookup the Rune ID:

```ts
import { useERC20Rune, useToken } from "@midl/executor-react";

const { erc20Address } = useERC20Rune("840000:1");
const { rune } = useToken("0x0000000000000000000000000000000000000000");
```

You can also compute the expected create2 address for a Rune:

```ts
import { getCreate2RuneAddress } from "@midl/executor";

const erc20Address = getCreate2RuneAddress("840000:1");
```
