import { useCallback, useState } from "react";

export const useToggle = (initialValue: boolean) => {
	const [value, setValue] = useState(initialValue);

	const toggle = useCallback((newValue: boolean) => {
		setValue((prev) => (typeof newValue === "boolean" ? newValue : !prev));
	}, []);

	return [value, toggle] as const;
};
