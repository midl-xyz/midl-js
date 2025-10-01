type EnumValues<E extends Record<string, string>> = E[keyof E];

type TupleUnion<U extends string, R extends unknown[] = []> = {
	[S in U]: Exclude<U, S> extends never
		? [...R, S]
		: TupleUnion<Exclude<U, S>, [...R, S]>;
}[U];

export type EnsureAllEnum<E extends Record<string, string>> = TupleUnion<
	EnumValues<E>
>;
