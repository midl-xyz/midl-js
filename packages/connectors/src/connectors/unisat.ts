import {
	type CreateConnectorFn,
	createConnector,
} from "@midl-xyz/midl-js-core";
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
