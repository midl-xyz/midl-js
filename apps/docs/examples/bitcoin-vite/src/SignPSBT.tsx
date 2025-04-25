import { useSignPSBT } from "@midl-xyz/midl-js-react";
import { useAccounts } from "@midl-xyz/midl-js-react";
import * as bitcoin from "bitcoinjs-lib";

export function SignPSBT() {
	const { signPSBT, data } = useSignPSBT();
	const { ordinalsAccount } = useAccounts();

	const sign = () => {
		if (!ordinalsAccount) {
			return;
		}

		const psbt = new bitcoin.Psbt();

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		psbt.addInput({
			// Add input data here
		});

		/// Form the PSBT

		signPSBT({
			psbt: psbt.toBase64(),
			signInputs: {
				[ordinalsAccount.publicKey]: [0],
			},
		});
	};

	return (
		<div>
			<button type="button" onClick={sign}>
				Sign PSBT
			</button>

			{data && (
				<div>
					<code>{JSON.stringify(data, null, 2)}</code>
				</div>
			)}
		</div>
	);
}
