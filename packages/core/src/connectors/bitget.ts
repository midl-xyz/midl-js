import { createConnector, UnisatConnector } from "~/connectors";

export const bitget = () => {
	return createConnector((config) => {
		return new UnisatConnector(config, "bitkeep.unisat", "Bitget Wallet");
	});
};
