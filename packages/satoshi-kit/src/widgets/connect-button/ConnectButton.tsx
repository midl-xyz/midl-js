"use client";

import { useAccounts } from "@midl-xyz/midl-js-react";
import { useSatoshiKit } from "~/app";
import { useToggle } from "~/shared/api";
import { Button } from "~/shared/ui/button";
import { AccountButton } from "~/widgets/account-button";
import { AccountDialog } from "~/widgets/account-dialog";
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
	children?: ({
		openConnectDialog,
		openAccountDialog,
		isConnected,
		isConnecting,
	}: {
		openConnectDialog: () => void;
		openAccountDialog: () => void;
		isConnected: boolean;
		isConnecting: boolean;
	}) => React.ReactNode;

	beforeConnect?: (id: string) => Promise<void> | void;
};

export const ConnectButton = ({
	hideAddress = false,
	hideBalance = false,
	beforeConnect,
	hideAvatar = false,
	children,
}: ConnectButtonProps) => {
	const { config } = useSatoshiKit();
	const { isConnected, isConnecting } = useAccounts({ config });
	const [isConnectDialogOpen, toggleConnectDialog] = useToggle(false);
	const [isAccountDialogOpen, toggleAccountDialog] = useToggle(false);

	return (
		<>
			<ConnectDialog
				open={isConnectDialogOpen}
				beforeConnect={beforeConnect}
				onClose={() => toggleConnectDialog(false)}
			/>

			{isConnected && (
				<AccountDialog
					open={isAccountDialogOpen}
					onClose={() => toggleAccountDialog(false)}
				/>
			)}

			{!children &&
				(isConnected ? (
					<AccountButton
						hideAddress={hideAddress}
						hideAvatar={hideAvatar}
						hideBalance={hideBalance}
						onClick={() => {
							toggleAccountDialog(true);
						}}
					/>
				) : (
					<Button
						onClick={() => {
							toggleConnectDialog(true);
						}}
						variant="solid"
						disabled={isConnecting}
						loading={isConnecting}
					>
						Connect Wallet
					</Button>
				))}

			{children?.({
				openConnectDialog: () => {
					toggleConnectDialog(true);
				},
				openAccountDialog: () => {
					toggleAccountDialog(true);
				},
				isConnected,
				isConnecting,
			})}
		</>
	);
};
