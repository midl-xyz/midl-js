import {
	type GetRunesParams,
	type GetRunesResponse,
	getRunes,
} from "@midl-xyz/midl-js-core";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

type QueryOptions = Omit<
	UseQueryOptions<GetRunesResponse>,
	"queryFn" | "queryKey"
> & {
	queryKey?: ReadonlyArray<unknown>;
};

type UseRunesParams = GetRunesParams & {
	query?: QueryOptions;
};

export const useRunes = ({
	address,
	limit,
	offset,
	query: { queryKey, ...query } = {} as QueryOptions,
}: UseRunesParams) => {
	const { config } = useMidlContext();

	const { data: runes, ...rest } = useQuery<GetRunesResponse>({
		queryKey: ["runes", address, limit, offset, ...(queryKey ?? [])],
		queryFn: () => {
			return getRunes(config, { address, limit, offset });
		},
		...query,
	});

	return {
		runes,
		...rest,
	};
};
