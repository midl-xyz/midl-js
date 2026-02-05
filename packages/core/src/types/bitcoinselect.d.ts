declare module "bitcoinselect" {
	export interface UTXO {
		txid: string | Uint8Array;
		vout: number;
		value: number;
		nonWitnessUtxo?: Uint8Array;
		witnessUtxo?: {
			script: Uint8Array;
			value: number;
		};
		redeemScript?: Uint8Array;
		witnessScript?: Uint8Array;
		isTaproot?: boolean;
	}

	export interface Target {
		address?: string;
		script?: Uint8Array;
		value?: number;
	}

	export interface SelectedUTXO {
		inputs?: UTXO[];
		outputs?: Target[];
		fee: number;
	}

	// Define the function
	function coinSelect(
		utxos: UTXO[],
		outputs: Target[],
		feeRate: number,
	): SelectedUTXO;

	// This syntax tells TS: "The whole module is this function"
	export = coinSelect;
}
