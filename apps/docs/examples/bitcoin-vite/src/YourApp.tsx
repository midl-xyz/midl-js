import { useAccounts } from "@midl-xyz/midl-js-react";
import { ConnectWallet } from "./ConnectWallet";
import { ConnectedAccounts } from "./ConnectedAccounts";
import { SendBitcoin } from "./SendBitcoin";
import { SignMessage } from "./SignMessage";
import { SignPSBT } from "./SignPSBT";

export function YourApp() {
	const { isConnected } = useAccounts();

	return (
		<div>
			{!isConnected && <ConnectWallet />}
			{isConnected && (
				<>
					<ConnectedAccounts />
					<SendBitcoin />
					<SignMessage />
					<SignPSBT />
				</>
			)}
		</div>
	);
}
