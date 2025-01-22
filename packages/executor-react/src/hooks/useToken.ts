import deployment from "@midl-xyz/contracts/deployments/0.0.6-alpha/Executor.json";
import { useRune } from "@midl-xyz/midl-js-react";
import type { Address } from "viem";
import { type UseReadContractParameters, useReadContract } from "wagmi";
import { executorAbi } from "@midl-xyz/midl-js-executor";
import { bytes32toRuneId } from "@midl-xyz/midl-js-executor";

type UseERC20Params = {
	query?: NonNullable<
		UseReadContractParameters<typeof executorAbi, "cMidlBtcAddresses">["query"]
	>;
};

/**
 * Custom hook to retrieve and convert the Rune ID associated with a specific EVM address.
 *
 * This hook fetches the bytes32 representation of a Rune ID for a given EVM address,
 * converts it to a standard Rune ID, and retrieves the corresponding Rune data.
 *
 * @example
 * ```typescript
 * const { rune, isLoading } = useToken('0xabc123...');
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
export const useToken = (address: Address, { query }: UseERC20Params = {}) => {
	const { data: bytes32RuneId, ...bytes32State } = useReadContract({
		abi: executorAbi,
		functionName: "cMidlBtcAddresses",
		// TODO: address depends on the network
		address: deployment.address as `0x${string}`,
		contractType: 1,
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

	const { rune, ...rest } = useRune({ runeId });

	return {
		state: rest,
		bytes32State,
		bytes32RuneId,
		rune,
	};
};
