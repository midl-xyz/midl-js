import { type CreateConnectorFn, createConnector } from "@midl/core";
import { UnisatConnector } from "~/providers";

export const okxConnector: CreateConnectorFn = ({ metadata } = {}) =>
	createConnector(
		{
			metadata: {
				name: "OKX",
			},
			create: () => new UnisatConnector("okxwallet.bitcoin"),
		},
		metadata,
	);
