import { useERC20Rune } from "@midl-xyz/midl-js-executor";
import { useEdictRune, useFeeRate } from "@midl-xyz/midl-js-react";

export const EdictRune = () => {
	const { edictRune, data, error } = useEdictRune();
	const { data: feeRate } = useFeeRate();
	// biome-ignore lint/style/noNonNullAssertion: RUNE_ID is set in the environment
	const { erc20Address } = useERC20Rune(import.meta.env.VITE_RUNE_ID!);

	const onClick = () => {
		edictRune({
			transfers: [
				{
					amount: 100_000 + (feeRate?.hourFee || 4) * 109 * 2,
					receiver: "tb1qsjcsryftgwyh3e0z0mvc6vdjx9pl8cx8dxrdxm",
				},
				{
					// biome-ignore lint/style/noNonNullAssertion: RUNE_ID is set in the environment
					runeId: import.meta.env.VITE_RUNE_ID!,
					amount: BigInt(1),
					receiver: "tb1qsjcsryftgwyh3e0z0mvc6vdjx9pl8cx8dxrdxm",
				},
			],
			publish: true,
		});
	};

	return (
		<div>
			<button onClick={onClick} type="button" data-testid="edict">
				Edict Rune
			</button>
			<p data-testid="edict-address">{erc20Address}</p>
			<p data-testid="edict-rune-id">{import.meta.env.VITE_RUNE_ID}</p>
			<p data-testid="edict-tx-id">{data?.txId}</p>
			<p data-testid="edict-psbt">{data?.psbt}</p>
			<p data-testid="edict-error">{error?.message}</p>
		</div>
	);
};
