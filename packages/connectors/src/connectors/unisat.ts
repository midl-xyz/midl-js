import { type CreateConnectorFn, createConnector } from "@midl/core";
import { UnisatConnector } from "~/providers";

export const unisatConnector: CreateConnectorFn = ({ metadata } = {}) =>
	createConnector(
		{
			metadata: {
				name: "Unisat",
			},
			create: () => new UnisatConnector(),
		},
		metadata,
	);
