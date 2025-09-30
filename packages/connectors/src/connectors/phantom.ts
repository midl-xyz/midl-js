import { type CreateConnectorFn, createConnector } from "@midl/core";
import { PhantomConnector } from "~/providers/PhantomConnector";

export const phantomConnector: CreateConnectorFn = ({ metadata } = {}) =>
	createConnector(
		{
			metadata: {
				name: "Phantom",
			},
			create: () => new PhantomConnector(),
		},
		metadata,
	);
