import { getUTXOs } from "@midl-xyz/midl-js-core";
import { useQuery } from "@tanstack/react-query";
import { useConfig } from "~/hooks/useConfig";

/**
 * Retrieves UTXOs for the specified address.
 *
 * @example
 * ```typescript
 * const { utxos, isLoading } = useUTXOs('bc1q...');
 * ```
 *
 * @param address - The Bitcoin address for which to retrieve UTXOs.
 *
 * @returns
 * - `utxos`: `Array<UTXO> | undefined` – The list of UTXOs for the specified address.
 * - `isLoading`: `boolean` – Indicates if the query is currently loading.
 * - `error`: `Error | null` – Contains error information if the query failed.
 * - `isFetching`: `boolean` – Indicates if the query is in the background fetching state.
 */
export const useUTXOs = (address?: string) => {
	const config = useConfig();

	const skipQuery = !config.network || !config.currentConnection || !address;

	const { data, ...rest } = useQuery({
		queryKey: ["utxos", address],
		queryFn: async () => {
			// biome-ignore lint/style/noNonNullAssertion: skip query if no address
			return getUTXOs(config, address!);
		},
		enabled: !skipQuery,
	});

	return {
		utxos: data,
		...rest,
	};
};
