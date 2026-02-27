export const mergeRefs = <T>(
	...refs: (React.Ref<T> | undefined)[]
): React.Ref<T> => {
	return (value) => {
		refs.forEach((ref) => {
			if (typeof ref === "function") {
				ref(value);
			} else if (ref) {
				(ref as React.MutableRefObject<T | null>).current = value;
			}
		});
	};
};
