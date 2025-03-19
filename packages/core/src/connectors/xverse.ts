import { createConnector } from "~/connectors";
import { SatsConnectConnector } from "~/connectors/sats-connect";

export const xverse = () => {
	return createConnector((config) => {
		const providerId = window.btc_providers?.find((it) =>
			it.name.includes("Xverse"),
		)?.id;

		return new SatsConnectConnector(config, providerId);
	});
};
