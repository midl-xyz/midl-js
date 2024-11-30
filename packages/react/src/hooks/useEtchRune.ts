import { type EtchRuneParams, etchRune } from "@midl-xyz/midl-js-core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useConfig } from "~/hooks/useConfig";

type EtchRuneData = Awaited<ReturnType<typeof etchRune>>;
type EtchRuneError = Error;
type EtchRuneVariables = EtchRuneParams;

type UseEtchRuneParams = {
	mutation?: Omit<
		UseMutationOptions<EtchRuneData, EtchRuneError, EtchRuneVariables>,
		"mutationFn"
	>;
};

export const useEtchRune = (params: UseEtchRuneParams) => {
	const config = useConfig();

	const mutation = useMutation<EtchRuneData, EtchRuneError, EtchRuneVariables>({
		mutationFn: (params) => {
			return etchRune(config, params);
		},
		...params.mutation,
	});

	return {
		etchRune: mutation.mutate,
		etchRuneAsync: mutation.mutateAsync,
		...mutation,
	};
};
