import { useAccounts } from "@midl-xyz/midl-js-react";
import { ConnectWallet } from "./ConnectWallet";
import { ConnectedAccounts } from "./ConnectedAccounts";
import { WriteContract } from "./WriteContract";

export function YourApp() {
	const { isConnected } = useAccounts();

	return (
		<div>
			{!isConnected && <ConnectWallet />}
			{isConnected && (
				<>
					<ConnectedAccounts />
					<WriteContract />
				</>
			)}
		</div>
	);
}
