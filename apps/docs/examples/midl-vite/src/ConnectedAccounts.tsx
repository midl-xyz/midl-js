import { useAccounts } from "@midl-xyz/midl-js-react";

export function ConnectedAccounts() {
	const { accounts } = useAccounts();

	return (
		<div>
			{accounts?.map((account) => (
				<div key={account.address}>
					<div>Address: {account.address}</div>
					<div>Public Key: {account.publicKey}</div>
				</div>
			))}
		</div>
	);
}
