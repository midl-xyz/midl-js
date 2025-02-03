import { useTransferBTC, useEdictRune } from "@midl-xyz/midl-js-react";

export function SendBitcoin() {
	const { transferBTC, data: btcData } = useTransferBTC();
	const { edictRune, data: runeData } = useEdictRune();

	const sendBitcoin = async () => {
		transferBTC({
			transfers: [
				{
					amount: 10000,
					receiver: "bcrt1qz4yz7junaupmav0ycmwheglahya7wuy0g7n6tc",
				},
			],
			publish: true,
		});
	};

	const sendRune = async () => {
		edictRune({
			transfers: [
				{
					runeId: "rune1", // Your rune ID
					amount: 10000n,
					receiver: "bcrt1qz4yz7junaupmav0ycmwheglahya7wuy0g7n6tc",
				},
			],
			publish: true,
		});
	};

	return (
		<div>
			<button type="button" onClick={sendBitcoin}>
				Send Bitcoin
			</button>

			<button type="button" onClick={sendRune}>
				Send Rune
			</button>

			{btcData && <div>{JSON.stringify(btcData)}</div>}
			{runeData && <div>{JSON.stringify(runeData)}</div>}
		</div>
	);
}
