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
import { type Address, encodeFunctionData, parseUnits } from "viem";
import { useChainId, useTransactionCount, useWalletClient } from "wagmi";
import { uniswapV2Router02Abi } from "../config/abi";
import { multisigAddress, uniswapRouterAddress } from "../config/addresses";
import { runeId } from "../config/rune";
import { useLogData } from "../hooks/useLogData";

const WETH = "0x76818770D192A506F90e79D5cB844E708be0D7A0";

export const Swap = () => {
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

	const bitcoinAmount = 0.000001;

	const onClick = async () => {
		const btcTx = await transferBTCAsync({
			transfers: [
				{
					receiver: multisigAddress,
					amount: 300_000 + Number(parseUnits(bitcoinAmount.toString(), 8)),
				},
			],
			publish: false,
		});

		const swapTx = await signTransactionAsync(
			logData({
				tx: {
					to: uniswapRouterAddress,
					data: encodeFunctionData({
						abi: uniswapV2Router02Abi,
						functionName: "swapExactETHForTokens",
						args: [
							0n,
							[WETH, erc20Address as Address],
							evmAddress,

							BigInt(
								Number.parseInt(
									((new Date().getTime() + 1000 * 60 * 15) / 1000).toString(),
								),
							),
						],
					}),
					btcTxHash: `0x${btcTx.tx.id}`,
					publicKey: p2tr as `0x${string}`,
					chainId,
					gas: 500_000n,
					gasPrice: 1000n,
					nonce: nonce,
					value: parseUnits(bitcoinAmount.toString(), 18),
				},
			}),
		);

		const txId = await walletClient?.sendRawTransaction({
			serializedTransaction: swapTx,
		});

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
			<button type="button" data-testid="swap" onClick={onClick}>
				Swap
			</button>

			{data && (
				<div>
					<p data-testid="swap-btc-tx">{data.btcTx}</p>
					<p data-testid="swap-tx-id">{data.txId}</p>
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
