import { createToaster } from "@ark-ui/react";

const toaster = createToaster({
	placement: "bottom-end",
	gap: 24,
});

export const useToaster = () => {
	return toaster;
};
