import type { Config } from "@midl/core";
import { SystemContracts, executorAbi, runeIdToBytes32 } from "@midl/executor";
import { useRune } from "@midl/react";
import { type UseReadContractParameters, useReadContract } from "wagmi";

type UseERC20Params = {
	/**
	 * Optional query parameters to customize the read contract query.
	 */
	query?: NonNullable<
		UseReadContractParameters<
			typeof executorAbi,
			"getAssetAddressByRuneId"
		>["query"]
	>;
	/**
	 * Custom configuration to override the default.
	 */
	config?: Config;
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
	{ query, config }: UseERC20Params = {},
) => {
	const { rune, ...rest } = useRune({ runeId, config });
	const bytes32RuneId = runeIdToBytes32(rune?.id ?? "");

	const { data: erc20Address, ...erc20rest } = useReadContract({
		abi: executorAbi,
		functionName: "getAssetAddressByRuneId",
		address: SystemContracts.Executor,
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
