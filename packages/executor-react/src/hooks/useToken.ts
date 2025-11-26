import deployment from "@midl/contracts/deployments/0.1.1/Executor.json";
import type { Config } from "@midl/core";
import { executorAbi } from "@midl/executor";
import { bytes32toRuneId } from "@midl/executor";
import { useRune } from "@midl/react";
import type { Address } from "viem";
import { type UseReadContractParameters, useReadContract } from "wagmi";

type UseERC20Params = {
	/**
	 * Custom query options for the read contract call.
	 */
	query?: NonNullable<
		UseReadContractParameters<
			typeof executorAbi,
			"getRuneIdByAssetAddress"
		>["query"]
	>;
	/**
	 * Custom configuration to override the default.
	 */
	config?: Config;
};

/**
 * Returns the Rune associated with a given EVM address.
 *
 * @example
 * ```typescript
 * const { rune } = useToken('0xabc123...');
 *
 * if (rune) {
 *   console.log(`Rune Name: ${rune.name}`);
 * }
 * ```
 *
 * @param {Address} address - The EVM address for which to retrieve the Rune.
 * @param {UseERC20Params} [options] - Optional parameters for the contract call.
 * @param {boolean} [options.query.enabled] - Whether the query is enabled.
 *
 * @returns
 * - **state**: `UseRuneReturn` – The state returned by the `useRune` hook.
 * - **bytes32State**: `UseReadContractReturn` – The state returned by the `useReadContract` hook for Rune ID.
 * - **bytes32RuneId**: `string | undefined` – The bytes32 representation of the Rune ID.
 * - **rune**: `Rune | undefined` – The corresponding Rune data.
 */
export const useToken = (
	address: Address,
	{ query, config: customConfig }: UseERC20Params = {},
) => {
	const { data: bytes32RuneId, ...bytes32State } = useReadContract({
		abi: executorAbi,
		functionName: "getRuneIdByAssetAddress",
		// TODO: address depends on the network
		address: deployment.address as `0x${string}`,
		args: [address],
		query: {
			enabled: query?.enabled ? query.enabled : !!address,
			...query,
		},
	});

	let runeId = "";

	try {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		runeId = bytes32toRuneId(bytes32RuneId!);
	} catch (e) {
		// do nothing
	}

	const { rune, ...rest } = useRune({ runeId, config: customConfig });

	return {
		state: rest,
		bytes32State,
		bytes32RuneId,
		rune,
	};
};
