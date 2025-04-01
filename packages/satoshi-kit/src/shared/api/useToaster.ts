import { createToaster } from "@ark-ui/react";

const toaster = createToaster({
	placement: "bottom-end",
	gap: 24,
});

// Return type is necessary to avoid Typescript type inference issues
export const useToaster = (): ReturnType<typeof createToaster> => {
	return toaster;
};
