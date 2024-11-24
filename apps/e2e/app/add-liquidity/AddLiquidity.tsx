import {
	useERC20Rune,
	useEVMAddress,
	usePublicKey,
	useSignTransaction,
} from "@midl-xyz/midl-js-executor";
import { useBroadcastTransaction, useEdictRune } from "@midl-xyz/midl-js-react";
import { useState } from "react";
import { encodeFunctionData, erc20Abi, parseUnits } from "viem";
import { useChainId, useTransactionCount, useWalletClient } from "wagmi";
import { uniswapV2Router02Abi } from "../config/abi";
import { multisigAddress, uniswapRouterAddress } from "../config/addresses";
import { runeId } from "../config/rune";
import { useLogData } from "../hooks/useLogData";

export const AddLiquidity = () => {
	const { erc20Address, rune } = useERC20Rune(runeId);
	const { signTransactionAsync } = useSignTransaction();
	const { edictRuneAsync } = useEdictRune();
	const [data, setData] = useState<{
		btcTx: string;
		approveTx: string;
		addLiquidityTx: string;
	} | null>(null);
	const evmAddress = useEVMAddress();
	const publicKey = usePublicKey();
	const { data: nonce = 0 } = useTransactionCount({ address: evmAddress });
	const chainId = useChainId();
	const { data: walletClient } = useWalletClient();
	const { broadcastTransactionAsync } = useBroadcastTransaction();
	const { log, logData } = useLogData();

	const bitcoinAmount = 0.0001;
	const runeAmount = 50_000n;

	const onClick = async () => {
		const btcTx = await edictRuneAsync({
			transfers: [
				{
					receiver: multisigAddress,
					amount: 300_000 + Number(parseUnits(bitcoinAmount.toString(), 8)),
				},
				{
					receiver: multisigAddress,
					// biome-ignore lint/style/noNonNullAssertion: RUNE_ID is set in the environment
					runeId: rune!.id,
					amount: runeAmount,
				},
			],
			publish: false,
		});

		const approveTx = await signTransactionAsync(
			logData({
				tx: {
					to: erc20Address,
					data: encodeFunctionData({
						abi: erc20Abi,
						functionName: "approve",
						args: [uniswapRouterAddress, runeAmount],
					}),
					btcTxHash: `0x${btcTx.tx.id}`,
					publicKey: publicKey as `0x${string}`,
					gas: 50_000n,
					gasPrice: 1000n,
					chainId,
					nonce: nonce,
				},
			}),
		);

		const addLiquidityTx = await signTransactionAsync(
			logData({
				tx: {
					to: uniswapRouterAddress,
					data: encodeFunctionData({
						abi: uniswapV2Router02Abi,
						functionName: "addLiquidityETH",
						args: [
							erc20Address as `0x${string}`,
							runeAmount,
							0n,
							0n,
							evmAddress,
							BigInt(
								Number.parseInt(
									((new Date().getTime() + 1000 * 60 * 15) / 1000).toString(),
								),
							),
						],
					}),
					btcTxHash: `0x${btcTx.tx.id}`,
					publicKey: publicKey as `0x${string}`,
					chainId,
					gas: 2_500_000n,
					gasPrice: 1000n,
					nonce: nonce + 1,
					value: parseUnits(bitcoinAmount.toString(), 18),
				},
			}),
		);

		const txIdApprove = await walletClient?.sendRawTransaction({
			serializedTransaction: approveTx,
		});

		const txIdAddLiquidity = await walletClient?.sendRawTransaction({
			serializedTransaction: addLiquidityTx,
		});

		setData({
			btcTx: btcTx.tx.id,
			approveTx: txIdApprove as string,
			addLiquidityTx: txIdAddLiquidity as string,
		});

		await broadcastTransactionAsync({
			tx: btcTx.tx.hex,
		});
	};

	return (
		<div>
			<button data-testid="add-liquidity" type="button" onClick={onClick}>
				Add Liquidity
			</button>

			{data && (
				<>
					<p data-testid="add-liquidity-btc-tx">{data.btcTx}</p>
					<p data-testid="add-liquidity-approve-tx">{data.approveTx}</p>
					<p data-testid="add-liquidity-add-liquidity-tx">
						{data.addLiquidityTx}
					</p>
				</>
			)}

			<pre>
				{log.map((l, i) => (
					<div key={i.toString()}>{l}</div>
				))}
			</pre>
		</div>
	);
};
