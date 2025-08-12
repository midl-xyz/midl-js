import deepmerge from "deepmerge";
import type { SignMessageParams, SignMessageResponse } from "~/actions";
import type { SignPSBTParams, SignPSBTResponse } from "~/actions/signPSBT";
import type { AddressPurpose, AddressType } from "~/constants";
import type { BitcoinNetwork } from "~/createConfig";

export type Account = {
	readonly address: string;
	readonly publicKey: string;
	readonly purpose: AddressPurpose;
	readonly addressType: AddressType;
};

export type NetworkConfig = {
	name: string;
	network: BitcoinNetwork["id"];
	rpcUrl: string;
	indexerUrl: string;
};

export type ConnectorConnectParams = {
	purposes: AddressPurpose[];
	network: BitcoinNetwork;
};

export interface Connector {
	readonly id: string;
	connect(params: ConnectorConnectParams): Promise<Account[]>;
	signMessage(
		params: SignMessageParams,
		network: BitcoinNetwork,
	): Promise<SignMessageResponse>;
	signPSBT(
		params: Omit<SignPSBTParams, "publish">,
		network: BitcoinNetwork,
	): Promise<Omit<SignPSBTResponse, "txId">>;

	beforeDisconnect?(): Promise<void>;
	switchNetwork?(network: BitcoinNetwork): Promise<Account[]>;
	addNetwork?(networkConfig: NetworkConfig): Promise<void>;
}

// biome-ignore lint/suspicious/noEmptyInterface: To allow for user-defined metadata
export interface UserMetadata {}

export interface ConnectorMetadata {
	name: string;
	icon?: string;
	description?: string;
	downloadUrls?: Partial<Record<"chrome" | "firefox" | "safari", string>>;
	website?: string;
}

export interface ConnectorFactory<T extends Connector> {
	metadata: ConnectorMetadata;
	create: () => T;
}

export type ConnectorWithMetadata<T extends Connector = Connector> = T & {
	metadata: ConnectorMetadata & UserMetadata;
};

export const createConnector = <T extends Connector>(
	factory: ConnectorFactory<T>,
	metadata: UserMetadata = {},
): ConnectorWithMetadata<T> => {
	const connector = factory.create() as ConnectorWithMetadata<T>;

	connector.metadata = deepmerge(factory.metadata, metadata);

	return connector;
};

export type CreateConnectorFn<Params = void> = Params extends void
	? (params?: { metadata?: UserMetadata }) => ConnectorWithMetadata<Connector>
	: (
			params: Params & { metadata?: UserMetadata },
		) => ConnectorWithMetadata<Connector>;
