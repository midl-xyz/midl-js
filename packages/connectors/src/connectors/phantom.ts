import {
	type CreateConnectorFn,
	createConnector,
} from "@midl-xyz/midl-js-core";
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
