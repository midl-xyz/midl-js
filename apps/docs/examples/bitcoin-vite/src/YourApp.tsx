import { ConnectWallet } from "./ConnectWallet";
import { ConnectedAccounts } from "./ConnectedAccounts";

export function YourApp() {
	return (
		<div>
			<ConnectWallet />
			<ConnectedAccounts />
		</div>
	);
}
