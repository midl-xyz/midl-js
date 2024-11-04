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

const WETH = "0x76818770D192A506F90e79D5cB844E708be0D7A0";

export const Swap = () => {
	// biome-ignore lint/style/noNonNullAssertion: RUNE_ID is set in the environment
	const { erc20Address, rune } = useERC20Rune(import.meta.env.VITE_RUNE_ID!);
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

	const bitcoinAmount = 0.000001;

	const onClick = async () => {
		const btcTx = await transferBTCAsync({
			transfers: [
				{
					receiver: multisigAddress,
					amount: 300_000 + Number(bitcoinAmount),
				},
			],
			publish: false,
		});

		const swapTx = await signTransactionAsync({
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
		});

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
		</div>
	);
};
