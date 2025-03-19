import { UnisatConnector } from "~/connectors";

export const createBitGetConnector = () => {
	return new UnisatConnector("bitkeep.unisat", "Bitget Wallet");
};
