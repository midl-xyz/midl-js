// biome-ignore lint/suspicious/noExplicitAny: generic type
export function get(obj: any, path: string) {
	return path.split(".").reduce((acc, key) => acc?.[key], obj);
}
