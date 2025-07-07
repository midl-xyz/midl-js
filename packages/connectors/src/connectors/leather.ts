import {
	type CreateConnectorFn,
	createConnector,
} from "@midl-xyz/midl-js-core";
import { LeatherConnector } from "~/providers";

export const leatherConnector: CreateConnectorFn = ({ metadata } = {}) =>
	createConnector(
		{
			metadata: {
				name: "Leather",
			},
			create: () => new LeatherConnector(),
		},
		metadata,
	);
