import {
	type CreateConnectorFn,
	UnisatConnector,
	createConnector,
} from "~/connectors";

export const bitgetConnector: CreateConnectorFn = ({ metadata } = {}) =>
	createConnector(
		{
			metadata: {
				name: "Bitget",
			},
			create: () => new UnisatConnector("bitkeep.unisat"),
		},
		metadata,
	);
