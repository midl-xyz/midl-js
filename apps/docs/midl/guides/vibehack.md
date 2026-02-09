---
order: -1
title: "VibeHack"
---

# VibeHack Guide

Welcome to the MIDL VibeHack (Feb 9 - 28, 2026)! This page is your starting point for building on MIDL during the hackathon.

::: tip Get Help
Join the [VibeHack Discord channel](https://discord.com/channels/1258788920276291624/1464158275804069941) to chat with other builders and get support from the MIDL team.
:::

## Quick Links

| Resource | Link |
|----------|------|
| Network Endpoints | [All URLs and chain details](./network-endpoints.md) |
| Faucet (regtest BTC) | [faucet.midl.xyz](https://faucet.midl.xyz) |
| EVM Explorer (Blockscout) | [blockscout.staging.midl.xyz](https://blockscout.staging.midl.xyz) |
| Bitcoin Explorer (Mempool) | [mempool.staging.midl.xyz](https://mempool.staging.midl.xyz) |
| Runes Minter | [runes.midl.xyz](https://runes.midl.xyz) |
| Discord | [VibeHack Channel](https://discord.com/channels/1258788920276291624/1464158275804069941) |

## What You'll Build

A typical VibeHack project involves three steps:

1. **Deploy a smart contract** to MIDL's regtest network
2. **Verify** the contract on Blockscout
3. **Build a frontend** with `midl-js` that interacts with your contract

## Step 1: Add MIDL Regtest to Xverse

Before you start, add the MIDL regtest network to your [Xverse](https://xverse.app) wallet. You can do this programmatically from your app using the `useAddNetwork` hook:

```tsx
import { useAddNetwork } from "@midl/react";

function AddMidlNetwork() {
  const { addNetwork } = useAddNetwork();

  const onAddNetwork = () => {
    addNetwork({
      connectorId: "xverse",
      networkConfig: {
        name: "MIDL Regtest",
        network: "regtest",
        rpcUrl: "https://rpc.staging.midl.xyz",
        indexerUrl: "https://mempool.staging.midl.xyz",
      },
    });
  };

  return (
    <button type="button" onClick={onAddNetwork}>
      Add MIDL Regtest to Xverse
    </button>
  );
}
```

This calls `wallet_addNetwork` on Xverse, which adds the MIDL regtest network and switches to it.

::: warning
`addNetwork` is currently supported only by the Xverse wallet.
:::

## Step 2: Get Regtest BTC

Claim regtest BTC from the [faucet](https://faucet.midl.xyz). You'll need this for deploying contracts and paying transaction fees.

To find your Bitcoin address, run:

```bash
pnpm hardhat midl:address
```

## Step 3: Deploy a Smart Contract

Follow the [Deploy Contract](./deploy-contract.md) guide to:

1. Set up a Hardhat project with `@midl/hardhat-deploy`
2. Configure it for the regtest network
3. Write and deploy your Solidity contract
4. Verify it on [Blockscout](https://blockscout.staging.midl.xyz)

See the [Network Endpoints](./network-endpoints.md) page for a ready-to-use Hardhat config with all the correct URLs.

## Step 4: Build a Frontend

Install the MIDL JS SDK packages and build your dApp:

```bash
pnpm add @midl/executor @midl/executor-react @midl/connectors @midl/core @midl/react
```

Follow these guides in order:

1. [Getting Started](../getting-started.md) — Set up providers and wallet connection
2. [Connect Wallet](/core/guides/connect-wallet) — Connect Xverse to your app
3. [Interact with Contract](./interact-contract.md) — Read and write to your deployed contract

## Step 5: Work with Runes (Optional)

If your project involves Bitcoin Runes:

- [Add a Rune](./runes/how-to-add-rune.md) — Auto-map a Rune to an ERC20 via deposit
- [Request Add Asset](./request-add-asset.md) — Map a Rune to your own custom ERC20 contract
- Mint Runes at [runes.midl.xyz](https://runes.midl.xyz)

## Need Help?

- Join the [VibeHack Discord channel](https://discord.com/channels/1258788920276291624/1464158275804069941)
- Check out the [starter repo](https://github.com/midl-xyz/smart-contract-deploy-starter) for examples
