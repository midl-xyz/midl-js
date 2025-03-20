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

export enum ConnectorType {
	Snap = "snap",
	Unisat = "unisat",
	SatsConnect = "satsConnect",
	Leather = "leather",
}

export type ConnectorConnectParams = {
	purposes: AddressPurpose[];
	network: BitcoinNetwork;
};

export interface Connector {
	readonly id: string;
	readonly name: string;
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
}
