import { SatsConnectConnector } from "~/connectors/sats-connect";

export const createXverseConnector = () => {
	const providerId =
		typeof window !== "undefined"
			? window.btc_providers?.find((it) => it.name.includes("Xverse"))?.id
			: undefined;

	return new SatsConnectConnector(providerId, "Xverse");
};
