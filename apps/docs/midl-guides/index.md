---
title: MIDL Guides
order: 2
---

# MIDL 

To interact with MIDL protocol, you need to use the `@midl-xyz/midl-js-executor` package.

Executor packages enable you to interact with the MIDL protocol to create more complex Bitcoin dApps.

## Concept

While the `@midl-xyz/midl-js-core` package provides the basic building blocks for interacting with Bitcoin, the executor packages provide pre-built functions that can be used to interact with the MIDL protocol.

Core feature of the executor is the ability to execute transaction intentions on the underlaying MIDL protocol which is handled by Bitcoin transactions.

### Flow

1. Create a transaction intention
2. Create a bitcoin transaction to transfer assets and fees
3. Sign the intention with reference to the Bitcoin transaction 
4. Publish the signed intention to the MIDL and Bitcoin network
5. Wait for the Bitcoin transaction to be confirmed