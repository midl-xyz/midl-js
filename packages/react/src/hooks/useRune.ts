import { type GetRuneResponse, getRune } from "@midl-xyz/midl-js-core";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useMidlContext } from "~/context";

type QueryOptions = Omit<
	UseQueryOptions<GetRuneResponse>,
	"queryFn" | "queryKey"
> & {
	queryKey?: ReadonlyArray<unknown>;
};

type UseRuneParams = {
	runeId: string;
	query?: QueryOptions;
};

export const useRune = ({
	runeId,
	query: { queryKey, ...query } = {} as QueryOptions,
}: UseRuneParams) => {
	const { config } = useMidlContext();

	const { data, ...rest } = useQuery<GetRuneResponse>({
		queryKey: ["rune", runeId, ...(queryKey ?? [])],
		queryFn: () => {
			return getRune(config, runeId);
		},
		retry: false,
		...query,
	});

	return {
		rune: data,
		...rest,
	};
};
