import {
	useERC20Rune,
	useEVMAddress,
	useP2TRPublicKey,
	useSignTransaction,
} from "@midl-xyz/midl-js-executor";
import {
	useBroadcastTransaction,
	useTransferBTC,
} from "@midl-xyz/midl-js-react";
import { useState } from "react";
import { encodeFunctionData } from "viem";
import { useChainId, useTransactionCount, useWalletClient } from "wagmi";
import { multisigAddress, uniswapRouterAddress } from "../config/addresses";
import { runeId } from "../config/rune";
import { useLogData } from "../hooks/useLogData";
import { executorAbi } from "../config/abi";

export const CompleteTx = () => {
	const { erc20Address } = useERC20Rune(runeId);
	const { signTransactionAsync } = useSignTransaction();
	const { transferBTCAsync } = useTransferBTC();
	const [data, setData] = useState<{
		btcTx: string;
		txId: string;
	} | null>(null);
	const evmAddress = useEVMAddress();
	const p2tr = useP2TRPublicKey();
	const { data: nonce = 0 } = useTransactionCount({ address: evmAddress });
	const chainId = useChainId();
	const { data: walletClient } = useWalletClient();
	const { broadcastTransactionAsync } = useBroadcastTransaction();
	const { log, logData } = useLogData();

	const onClick = async () => {
		const btcTx = await transferBTCAsync({
			transfers: [
				{
					receiver: multisigAddress,
					amount: 500_000,
				},
			],
			publish: false,
		});

		const swapTx = await signTransactionAsync(
			logData({
				tx: {
					to: uniswapRouterAddress,
					data: encodeFunctionData({
						abi: executorAbi,
						functionName: "completeTx",
						args: [
							`0x${btcTx.tx.id}`,
							BigInt(0),
							p2tr as `0x${string}`,
							[erc20Address as `0x${string}`],
							[0n],
						],
					}),
					btcTxHash: `0x${btcTx.tx.id}`,
					publicKey: p2tr as `0x${string}`,
					chainId,
					gas: 500_000n,
					gasPrice: 1000n,
					nonce: nonce,
				},
			}),
		);

		const txId = await walletClient?.sendRawTransaction({
			serializedTransaction: swapTx,
		});

		if (!txId) {
			throw new Error("Failed to send transaction");
		}

		setData({
			btcTx: btcTx.tx.id,
			txId: txId as string,
		});

		await broadcastTransactionAsync({
			tx: btcTx.tx.hex,
		});
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
