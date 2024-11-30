import { getUTXOs } from "@midl-xyz/midl-js-core";
import { useQuery } from "@tanstack/react-query";
import { useConfig } from "~/hooks/useConfig";

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
