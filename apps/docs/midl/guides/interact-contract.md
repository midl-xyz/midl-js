# Interact with Contract

Writing to a contract is a common operation in a dApp. This guide demonstrates how to write to a contract using MIDL protocol with a web application. 

Writing to a contract in MIDL requires a BTC transaction to cover fees, transfer assets required for execution, and to form the EVM transaction that interacts with the contract. You can read more about it [here](../how-it-works.md).

## 1. Install dependencies

Follow the [Installation guide](../getting-started.md#installation) to install the required dependencies.


Also in this example we will use `viem` and `wagmi` packages to interact with EVM contracts. You can install them via your package manager of choice.

::: code-group

```bash [pnpm]
pnpm add viem wagmi
```

```bash [npm]
npm install viem wagmi
```

```bash [yarn]
yarn add viem wagmi
```
:::


## 2. Set up the project

Follow the [Connect Wallet guide](../core/guides/connect-wallet.md) to setup the project.

## 3. Add WriteContract component

::: code-group

```tsx [WriteContract.tsx]
import {
    useAddTxIntention,
    useFinalizeBTCTransaction,
    useSignIntention,
} from "@midl/executor-react";
import {
    useWaitForTransaction
} from "@midl/react";
import { encodeFunctionData } from "viem";
import { usePublicClient, useReadContract } from "wagmi";
import { SimpleStorage } from "./SimpleStorage";

export function WriteContract() {
    const { addTxIntention, txIntentions } = useAddTxIntention();
    const { finalizeBTCTransaction, data } =
        useFinalizeBTCTransaction();

    const { signIntentionAsync } = useSignIntention();

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
        finalizeBTCTransaction();
    };

    const onSignIntentions = async () => {
        if (!data) {
            alert("Please finalize BTC transaction first");
            return;
        }

        for (const intention of txIntentions) {
            await signIntentionAsync({
                intention,
                txId: data.tx.id,
            });
        }
    };

    const onBroadcast = async () => {
        if (!data) {
            alert("Please finalize BTC transaction first");
            return;
        }

        await publicClient?.sendBTCTransactions({
            serializedTransactions: txIntentions.map(it => it.signedEvmTransaction as `0x${string}`),
            btcTransaction: data.tx.hex,
        })

        waitForTransaction({ txId: data.tx.id });
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

## 4. Put it all together

Add the `WriteContract` component to your app:

::: code-group

```tsx{4,15} [YourApp.tsx]
import { useAccounts } from "@midl/react";
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
