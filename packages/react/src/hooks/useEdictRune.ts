import {
	type EdictRuneParams,
	type EdictRuneResponse,
	edictRune,
} from "@midl-xyz/midl-js-core";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useConfig } from "~/hooks/useConfig";

type EdictRuneVariables = EdictRuneParams;

type EdictRuneError = Error;

type EdictRuneData = EdictRuneResponse;

type UseEdictRuneParams = {
	mutation?: Omit<
		UseMutationOptions<EdictRuneData, EdictRuneError, EdictRuneVariables>,
		"mutationFn"
	>;
};

export const useEdictRune = ({ mutation }: UseEdictRuneParams = {}) => {
	const config = useConfig();
	const { mutationKey = [], ...mutationParams } = mutation ?? {};

	const { mutate, mutateAsync, ...rest } = useMutation<
		EdictRuneData,
		EdictRuneError,
		EdictRuneVariables
	>({
		mutationKey: ["edictRune", ...mutationKey],
		mutationFn: async (params) => {
			return edictRune(config, params);
		},
		...mutationParams,
	});

	return {
		edictRune: mutate,
		edictRuneAsync: mutateAsync,
		...rest,
	};
};
