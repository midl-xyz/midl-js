type Phantom = {
	requestAccounts: () => Promise<
		{
			address: string;
			publicKey: string;
			addressType: "p2tr" | "p2wpkh" | "p2sh" | "p2pkh";
			purpose: AddressPurpose;
		}[]
	>;
	signPSBT(
		psbt: Uint8Array,
		options: {
			inputsToSign: {
				sigHash?: number | undefined;
				address: string;
				signingIndexes: number[];
			}[];
		},
	): Promise<Uint8Array>;
	signMessage(
		address: string,
		message: Uint8Array,
	): Promise<{
		signature: Uint8Array;
	}>;
};
