import { useAccounts } from "@midl-xyz/midl-js-react";
import { useState } from "react";
import { Button } from "~/shared/ui/button";
import { AccountButton } from "~/widgets/account-button";
import { ConnectDialog } from "~/widgets/connect-dialog";

type ConnectButtonProps = {
	/**
	 * If true, the balance will be hidden in the account button.
	 * @default false
	 */
	hideBalance?: boolean;

	/**
	 * If true, the avatar will be hidden in the account button.
	 * @default false
	 */
	hideAvatar?: boolean;

	/**
	 * If true, the address will be hidden in the account button.
	 * @default false
	 */
	hideAddress?: boolean;
};

export const ConnectButton = ({
	hideAddress = true,
	hideBalance = true,
	hideAvatar = true,
}: ConnectButtonProps) => {
	const { isConnected, isConnecting } = useAccounts();
	const [isDialogOpen, setDialogOpen] = useState(false);

	const onConnect = () => {
		setDialogOpen(true);
	};

	if (isConnected) {
		return (
			<AccountButton
				hideAddress={hideAddress}
				hideAvatar={hideAvatar}
				hideBalance={hideBalance}
			/>
		);
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
