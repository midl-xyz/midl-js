import { SatsConnectConnector } from "~/connectors/sats-connect";

export const createXverseConnector = () => {
	const providerId = window.btc_providers?.find((it) =>
		it.name.includes("Xverse"),
	)?.id;

	return new SatsConnectConnector(providerId, "XVerse Wallet");
};
