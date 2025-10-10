export const safeJSONStringify = (obj: unknown): string => {
	return JSON.stringify(obj, (_, value) => {
		if (typeof value === "bigint") {
			return value.toString();
		}
		return value;
	});
};
