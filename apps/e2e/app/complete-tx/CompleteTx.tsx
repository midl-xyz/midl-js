import {useERC20Rune, useEVMAddress, usePublicKey, useSignTransaction,} from "@midl-xyz/midl-js-executor-react";
import {useTransferBTC} from "@midl-xyz/midl-js-react";
import {useState} from "react";
import {encodeFunctionData} from "viem";
import {useChainId, useTransactionCount, useWalletClient} from "wagmi";
import {executorAbi} from "../config/abi";
import {executorAddress, multisigAddress} from "../config/addresses";
import {runeId} from "../config/rune";
import {useLogData} from "../hooks/useLogData";

export const CompleteTx = () => {
    const {erc20Address} = useERC20Rune(runeId);
    const {signTransactionAsync} = useSignTransaction();
    const {transferBTCAsync} = useTransferBTC();
    const [data, setData] = useState<{
        btcTx: string;
        txId: string;
    } | null>(null);
    const evmAddress = useEVMAddress();
    const publicKey = usePublicKey();
    const {data: nonce = 0, refetch} = useTransactionCount({address: evmAddress});
    const chainId = useChainId();
    const {data: walletClient} = useWalletClient();
    const {log, logData} = useLogData();

    const onClick = async () => {
        try {
            await refetch();
            const btcTx = await transferBTCAsync({
                transfers: [
                    {
                        receiver: multisigAddress,
                        amount: 500_000,
                    },
                ],
                publish: false,
            });

            const completeTx = await signTransactionAsync(
                logData({
                    tx: {
                        to: executorAddress,
                        data: encodeFunctionData({
                            abi: executorAbi,
                            functionName: "completeTx",
                            args: [
                                `0x${btcTx.tx.id}`,
                                publicKey as `0x${string}`,
                                `0x0000000000000000000000000000000000000000000000000000000000000000`,
                                [erc20Address as `0x${string}`],
                                [0n],
                            ],
                        }),
                        btcTxHash: `0x${btcTx.tx.id}`,
                        publicKey: publicKey as `0x${string}`,
                        chainId,
                        gas: 500_000n,
                        gasPrice: 1000n,
                        nonce: nonce,
                        value: 0n,
                    },
                }),
            );

            const txHashes = await walletClient?.sendMidlTransactionsPack({
                serializedTransactions: [completeTx],
                btcTransaction: btcTx.tx.hex,
            });
            setData({btcTx: btcTx.tx.id, txId: txHashes?.[0] ?? ""});
            await refetch();
        } catch (err) {
            alert(`Transaction failed: ${err}`);
        }
    };

    return (
        <div>
            <button type="button" data-testid="complete-tx" onClick={onClick}>
                Complete Tx
            </button>

            {data && (
                <div>
                    <p data-testid="complete-tx-btc-tx">{data.btcTx}</p>
                    <p data-testid="complete-tx-tx-id">{data.txId}</p>
                </div>
            )}

            <pre>
				{log.map((e, i) => (
                    <pre key={i.toString()}>{e}</pre>
                ))}
			</pre>
        </div>
    );
};
