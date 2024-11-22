import { useERC20Rune } from "@midl-xyz/midl-js-executor";
import { useEdictRune, useFeeRate } from "@midl-xyz/midl-js-react";
import { multisigAddress } from "../config/addresses";
import { runeId } from "../config/rune";

export const EdictRune = () => {
	const { edictRune, data, error } = useEdictRune();
	const { data: feeRate } = useFeeRate();
	const { erc20Address, rune, erc20State } = useERC20Rune(runeId);

	const onClick = () => {
		edictRune({
			transfers: [
				{
					amount: 100_000 + (feeRate?.hourFee || 4) * 109 * 2,
					receiver: multisigAddress,
				},
				{
					// biome-ignore lint/style/noNonNullAssertion: RUNE_ID is set in the environment
					runeId: rune!.id,
					amount: BigInt(1),
					receiver: multisigAddress,
				},
			],
			publish: true,
		});
	};

	console.log(erc20State.error);

	return (
		<div>
			<button onClick={onClick} type="button" data-testid="edict">
				Edict Rune
			</button>
			<p data-testid="edict-address">{erc20Address ?? "no address"}</p>
			<p data-testid="edict-rune-id">{rune?.id}</p>
			<p data-testid="edict-tx-id">{data?.tx.id}</p>
			<p data-testid="edict-psbt">{data?.psbt}</p>
			<p data-testid="edict-error">{error?.message}</p>
		</div>
	);
};
