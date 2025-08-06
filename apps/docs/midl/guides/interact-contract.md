# Interact with Contract

::: warning
THE DOCUMENTATION IS OUTDATED AND MAY NOT REFLECT THE CURRENT STATE OF THE PROJECT.
:::

Writing to a contract is a common operation in a dApp. This guide demonstrates how to write to a contract using MIDL protocol with a web application. 

Additionally, you may write to contract using midl-xyz/hardhat-deploy. You can read more about it [here](./deploy-contract.md)

Writing a contract in MIDL requires a BTC transaction to cover the fees, transfer assets required for transaction execution and to form EVM transaction to interact with the contract. You can read more about it [here](../how-it-works.md).

The example below is available in the [examples](https://github.com/midl-xyz/midl-js/tree/main/apps/docs/examples).

## 1. Setup the project

Follow the [Connect Wallet guide](../core/guides/connect-wallet.md) to setup the project.

## 2. Install dependencies

Follow the [Installation guide](../getting-started.md#installation) to install the required dependencies.

## 3. Configure the app

Modify the `App.tsx` file to include the `WagmiProvider` and `WagmiMidlProvider`:

::: code-group

```tsx{3,4,7,11,14,19} [App.tsx]
import { MidlProvider } from "@midl-xyz/midl-js-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiMidlProvider } from "@midl-xyz/midl-js-executor-react";
import { WagmiProvider } from "wagmi";
import { queryClient } from "./query-client";
import { midlConfig } from "./midlConfig";
import { wagmiConfig } from "./wagmiConfig";

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <MidlProvider config={midlConfig}>
        <QueryClientProvider client={queryClient}>
          <WagmiMidlProvider />

          <YourApp />
        </QueryClientProvider>
      </MidlProvider>
    </WagmiProvider>
  );
}
```

```ts [wagmiConfig.ts]
import { midlRegtest } from "@midl-xyz/midl-js-executor";
import type { Chain } from "viem";
import { createConfig, http } from "wagmi";

export const wagmiConfig = createConfig({
  chains: [
    {
      ...midlRegtest,
      rpcUrls: {
        default: {
          http: [midlRegtest.rpcUrls.default.http[0]],
        },
      },
    } as Chain,
  ],
  transports: {
    [midlRegtest.id]: http(midlRegtest.rpcUrls.default.http[0]),
  },
});
```

:::

## 4. Add WriteContract component

::: code-group

```tsx [WriteContract.tsx]
import {
  useAddTxIntention,
  useFinalizeTxIntentions,
} from "@midl-xyz/midl-js-executor-react";
import {
  useBroadcastTransaction,
  useWaitForTransaction,
} from "@midl-xyz/midl-js-react";
import { encodeFunctionData } from "viem";
import { useReadContract, usePublicClient } from "wagmi";
import { SimpleStorage } from "./SimpleStorage";

export function WriteContract() {
  const { addTxIntention, txIntentions } = useAddTxIntention();
  const { finalizeBTCTransaction, btcTransaction, signIntentionAsync } =
    useFinalizeTxIntentions();

  const { broadcastTransaction } = useBroadcastTransaction();
  const publicClient = usePublicClient();
  const { waitForTransaction } = useWaitForTransaction({
    mutation: {
      onSuccess: () => {
        refetch();
      },
    },
  });

  const { data: message, refetch } = useReadContract({
    abi: SimpleStorage.abi,
    functionName: "getMessage",
    address: SimpleStorage.address as `0x${string}`,
  });

  const onAddIntention = () => {
    addTxIntention({
      reset: true,
      intention: {
        evmTransaction: {
          to: SimpleStorage.address as `0x${string}`,
          data: encodeFunctionData({
            abi: SimpleStorage.abi,
            functionName: "setMessage",
            args: [`Updated message at ${new Date().toISOString()}`],
          }),
        },
      },
    });
  };

  const onFinalizeBTCTransaction = () => {
    finalizeBTCTransaction({
      feeRateMultiplier: 4,
    });
  };

  const onSignIntentions = async () => {
    if (!btcTransaction) {
      alert("Please finalize BTC transaction first");
      return;
    }

    for (const intention of txIntentions) {
      await signIntentionAsync({
        intention,
        txId: btcTransaction.tx.id,
      });
    }
  };

  const onBroadcast = async () => {
    if (!btcTransaction) {
      alert("Please finalize BTC transaction first");
      return;
    }

    broadcastTransaction({ tx: btcTransaction.tx.hex });

    console.log(`BTC Transaction sent: ${btcTransaction.tx.id}`);

    for (const intention of txIntentions) {
      const tx = await walletClient?.sendRawTransaction({
        serializedTransaction: intention.signedEvmTransaction as `0x${string}`,
      });

      console.log(`Transaction sent: ${tx}`);
    }

    waitForTransaction({ txId: btcTransaction.tx.id });
  };

  return (
    <div>
      <h2>Current message:</h2>
      <div>{message as string}</div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "300px",
          margin: "3rem auto",
        }}
      >
        <div>
          <h3>1. Add Transaction intention</h3>
          <button
            type="button"
            onClick={onAddIntention}
            disabled={txIntentions.length > 0}
          >
            Add Intention
          </button>
        </div>

        <div>
          <h3> 2. Calculate transaction costs and form BTC Tx</h3>
          <button type="button" onClick={onFinalizeBTCTransaction}>
            Finalize BTC Transaction
          </button>
        </div>

        <div>
          <h3>3. Sign transaction intentions</h3>

          <button type="button" onClick={onSignIntentions}>
            Sign Intentions
          </button>
        </div>

        <div>
          <h3>4. Publish transactions </h3>
          <button type="button" onClick={onBroadcast}>
            Broadcast transactions
          </button>
        </div>
      </div>

      <h4>Tx Intentions</h4>
      <pre
        style={{
          wordBreak: "break-all",
          whiteSpace: "pre-wrap",
          textAlign: "left",
        }}
      >
        {JSON.stringify(txIntentions, null, 2)}
      </pre>
    </div>
  );
}
```

```tsx [SimpleStorage.ts]
export const SimpleStorage = {
  address: "0x015bceEFA137a662aFC0347Cb6fc204192960094",
  abi: [
    {
      inputs: [
        {
          internalType: "string",
          name: "initialMessage",
          type: "string",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "string",
          name: "newMessage",
          type: "string",
        },
      ],
      name: "MessageUpdated",
      type: "event",
    },
    {
      inputs: [],
      name: "getMessage",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "newMessage",
          type: "string",
        },
      ],
      name: "setMessage",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};
```

:::

## 5. Put it all together

Add the `WriteContract` component to your app:

::: code-group

```tsx{4,15} [YourApp.tsx]
import { useAccounts } from "@midl-xyz/midl-js-react";
import { ConnectWallet } from "./ConnectWallet";
import { ConnectedAccounts } from "./ConnectedAccounts";
import { WriteContract } from "./WriteContract";

export function YourApp() {
  const { isConnected } = useAccounts();

  return (
    <div>
      {!isConnected && <ConnectWallet />}
      {isConnected && (
        <>
          <ConnectedAccounts />
          <WriteContract />
        </>
      )}
    </div>
  );
}
```

:::
