---
order: 3
title: "Request Add Asset"
---

# Request Add Asset

`requestAddAsset` maps a Bitcoin Rune to a **custom ERC20 token** on MIDL's EVM side. This is useful when you want to bring your own ERC20 contract rather than using the auto-created one that MIDL generates on first deposit.

::: tip
If you just want the default auto-mapped ERC20, you can skip this guide and use the simpler path described in [Add a Rune](./runes/how-to-add-rune.md).
:::

::: warning
You must wait for at least **6 Bitcoin block confirmations** after creating a Rune before calling `requestAddAsset`. If the Rune creation transaction is not yet sufficiently confirmed, the mapping will fail.
:::

## Prerequisites

- A configured MIDL app (see [Getting Started](../getting-started.md)).
- A connected wallet with Rune UTXOs for the Rune you want to map.
- A deployed ERC20 contract address on MIDL that will represent your Rune.

## How It Works

Calling `requestAddAsset` on the Executor contract does the following:

1. Sends an EVM transaction to the Executor's `requestAddAsset(address, bytes32)` function, passing the ERC20 contract address and the Rune ID.
2. Includes a deposit of **10,000 satoshis** (the mapping fee) plus the Rune amount you wish to deposit.
3. Once confirmed, the Executor registers the mapping between the Rune and your custom ERC20 contract.

## Step-by-step React Example

This follows the same intention pattern used in the [Interact with Contract](./interact-contract.md) guide.

### 1. Create the intention

Use the `useAddRequestAddAssetIntention` hook to create the intention:

```tsx
import {
  useAddRequestAddAssetIntention,
} from "@midl/executor-react";

const { addRequestAddAssetIntention } = useAddRequestAddAssetIntention();

const onAddIntention = () => {
  addRequestAddAssetIntention({
    reset: true,
    address: "0xYourERC20ContractAddress" as `0x${string}`,
    runeId: "840000:1",
    amount: 1000n,
  });
};
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `address` | `` `0x${string}` `` | The ERC20 contract address to map to |
| `runeId` | `string` | The Rune ID (e.g. `"840000:1"`) |
| `amount` | `bigint` | Amount of the Rune to deposit |
| `reset` | `boolean` | If `true`, replaces any existing intentions |

### 2. Finalize the BTC transaction

```tsx
import { useFinalizeBTCTransaction } from "@midl/executor-react";

const { finalizeBTCTransaction, data } = useFinalizeBTCTransaction();

const onFinalize = () => {
  finalizeBTCTransaction();
};
```

### 3. Sign intentions

```tsx
import { useSignIntention } from "@midl/executor-react";

const { signIntentionAsync } = useSignIntention();

const onSign = async () => {
  for (const intention of txIntentions) {
    await signIntentionAsync({
      intention,
      txId: data.tx.id,
    });
  }
};
```

### 4. Broadcast

```tsx
import { usePublicClient } from "wagmi";

const publicClient = usePublicClient();

const onBroadcast = async () => {
  await publicClient?.sendBTCTransactions({
    serializedTransactions: txIntentions.map(
      (it) => it.signedEvmTransaction as `0x${string}`
    ),
    btcTransaction: data.tx.hex,
  });
};
```

## Full Component Example

```tsx
import {
  useAddRequestAddAssetIntention,
  useFinalizeBTCTransaction,
  useSignIntention,
} from "@midl/executor-react";
import { useWaitForTransaction } from "@midl/react";
import { usePublicClient } from "wagmi";

export function RequestAddAsset() {
  const { addRequestAddAssetIntention, data: intentionData } =
    useAddRequestAddAssetIntention();
  const { finalizeBTCTransaction, data } = useFinalizeBTCTransaction();
  const { signIntentionAsync } = useSignIntention();
  const publicClient = usePublicClient();
  const { waitForTransaction } = useWaitForTransaction();

  const txIntentions = intentionData ? [intentionData] : [];

  const onAddIntention = () => {
    addRequestAddAssetIntention({
      reset: true,
      address: "0xYourERC20ContractAddress" as `0x${string}`,
      runeId: "840000:1",
      amount: 1000n,
    });
  };

  const onFinalize = () => {
    finalizeBTCTransaction();
  };

  const onSign = async () => {
    if (!data) return;

    for (const intention of txIntentions) {
      await signIntentionAsync({
        intention,
        txId: data.tx.id,
      });
    }
  };

  const onBroadcast = async () => {
    if (!data) return;

    await publicClient?.sendBTCTransactions({
      serializedTransactions: txIntentions.map(
        (it) => it.signedEvmTransaction as `0x${string}`
      ),
      btcTransaction: data.tx.hex,
    });

    waitForTransaction({ txId: data.tx.id });
  };

  return (
    <div>
      <button type="button" onClick={onAddIntention}>
        1. Add Intention
      </button>
      <button type="button" onClick={onFinalize}>
        2. Finalize BTC Transaction
      </button>
      <button type="button" onClick={onSign}>
        3. Sign Intentions
      </button>
      <button type="button" onClick={onBroadcast}>
        4. Broadcast
      </button>
    </div>
  );
}
```

## Key Details

- **Mapping fee:** 10,000 satoshis are required as a deposit fee for the mapping. This is handled automatically by the `addRequestAddAssetIntention` action.
- **Rune deposit:** The intention includes both the mapping fee and your specified Rune amount in the BTC transaction's deposit structure.
- **Querying the mapping:** After the transaction confirms, you can look up the mapping using:

```ts
import { useToken } from "@midl/executor-react";

// Get the Rune associated with an ERC20 address
const { rune } = useToken("0xYourERC20ContractAddress");
```

Or compute the expected create2 address for a Rune:

```ts
import { getCreate2RuneAddress } from "@midl/executor";

const expectedAddress = getCreate2RuneAddress("840000:1");
```

## See Also

- [Add a Rune](./runes/how-to-add-rune.md) — The simpler auto-mapping path
- [Interact with Contract](./interact-contract.md) — General pattern for contract interactions
- [Deploy Contract](./deploy-contract.md) — Deploying your ERC20 contract
