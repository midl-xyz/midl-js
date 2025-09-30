import { type CreateConnectorFn, createConnector } from "@midl/core";
import { UnisatConnector } from "~/providers";

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
