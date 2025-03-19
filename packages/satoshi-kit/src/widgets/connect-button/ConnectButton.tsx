import { useAccounts } from "@midl-xyz/midl-js-react";
import { useState } from "react";
import { Button } from "~/shared/ui/button";
import { AccountButton } from "~/widgets/account-button";
import { ConnectDialog } from "~/widgets/connect-dialog";

export const ConnectButton = () => {
	const { isConnected, isConnecting } = useAccounts();
	const [isDialogOpen, setDialogOpen] = useState(false);

	const onConnect = () => {
		setDialogOpen(true);
	};

	if (isConnected) {
		return <AccountButton />;
	}

	return (
		<>
			<ConnectDialog open={isDialogOpen} onClose={() => setDialogOpen(false)} />
			<Button
				onClick={onConnect}
				variant="subtle"
				disabled={isConnecting}
				loading={isConnecting}
			>
				Connect Wallet
			</Button>
		</>
	);
};
