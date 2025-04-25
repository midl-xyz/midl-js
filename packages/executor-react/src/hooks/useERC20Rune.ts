import deployment from "@midl-xyz/contracts/deployments/0.0.10/Executor.json";
import { executorAbi, runeIdToBytes32 } from "@midl-xyz/midl-js-executor";
import { useRune } from "@midl-xyz/midl-js-react";
import { type UseReadContractParameters, useReadContract } from "wagmi";

type UseERC20Params = {
	query?: NonNullable<
		UseReadContractParameters<
			typeof executorAbi,
			"getAssetAddressByRuneId"
		>["query"]
	>;
};

/**
 * Retrieve the ERC20 address associated with a Rune.
 *
 * @example
 * ```typescript
 * const { erc20Address, rune } = useERC20Rune('rune-123');
 *
 * if (erc20Address) {
 *   console.log(`ERC20 Address: ${erc20Address}`);
 * }
 * ```
 *
 * @param runeId - The ID of the Rune for which to retrieve the ERC20 address.
 * @param options Optional parameters to customize the query.
 *
 * @returns
 * - **state**: `UseRuneReturn` – The state returned by the `useRune` hook.
 * - **erc20State**: `UseReadContractReturn` – The state returned by the `useReadContract` hook for ERC20 address.
 * - **rune**: `Rune | undefined` – The Rune data.
 * - **erc20Address**: `string | undefined` – The ERC20 contract address associated with the Rune.
 */
export const useERC20Rune = (
	runeId: string,
	{ query }: UseERC20Params = {},
) => {
	const { rune, ...rest } = useRune({ runeId });
	const bytes32RuneId = runeIdToBytes32(rune?.id ?? "");

	const { data: erc20Address, ...erc20rest } = useReadContract({
		abi: executorAbi,
		functionName: "getAssetAddressByRuneId",
		// TODO: address depends on the network
		address: deployment.address as `0x${string}`,
		contractType: 1,
		args: [bytes32RuneId],
		query: {
			enabled: query?.enabled ? query.enabled : !!rune,
			...query,
		},
	});

	return {
		state: rest,
		erc20State: erc20rest,
		rune,
		erc20Address,
	};
};
