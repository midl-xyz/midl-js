import { useMidlContext } from "~/context";

export const useConfig = () => {
	const { config } = useMidlContext();
	return config;
};
