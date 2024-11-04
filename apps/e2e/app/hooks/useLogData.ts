import { useState } from "react";

export const useLogData = () => {
	const [log, setLog] = useState<string[]>([]);

	const logData = <T = unknown>(data: T) => {
		setLog((prev) => [...prev, JSON.stringify(data, null, 2)]);

		return data;
	};

	return { log, logData };
};
