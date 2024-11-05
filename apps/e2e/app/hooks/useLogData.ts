/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

export const useLogData = () => {
	const [log, setLog] = useState<string[]>([]);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const logData = <T = unknown>(data: T): any => {
		setLog((prev) => [...prev, JSON.stringify(data, null, 2)]);

		return data as T;
	};

	return { log, logData };
};
