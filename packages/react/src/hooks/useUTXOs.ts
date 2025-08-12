import { type Config, getUTXOs } from "@midl-xyz/midl-js-core";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useConfig } from "~/hooks/useConfig";
import { useConfigInternal } from "~/hooks/useConfigInternal";

type QueryOptions = Omit<UseQueryOptions, "queryFn" | "queryKey"> & {
	queryKey?: ReadonlyArray<unknown>;
};

type UseUTXOsParams = {
	/**
	 * Custom configuration to override the default.
	 */
	config?: Config;
	/**
	 * Query options for the UTXOs operation.
	 */
	query?: QueryOptions;
};

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
export const useUTXOs = (
	address?: string,
	{ config: customConfig, query }: UseUTXOsParams = {},
) => {
	const { network, connection } = useConfig(customConfig);
	const config = useConfigInternal(customConfig);

	const skipQuery = !network || !connection || !address;

	const { data, ...rest } = useQuery({
		queryKey: ["utxos", address],
		queryFn: async () => {
			// biome-ignore lint/style/noNonNullAssertion: skip query if no address
			return getUTXOs(config, address!);
		},
		enabled: !skipQuery,
		...query,
	});

	return {
		utxos: data,
		...rest,
	};
};
