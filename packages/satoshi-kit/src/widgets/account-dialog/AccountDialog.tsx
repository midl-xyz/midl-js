import { AddressPurpose } from "@midl-xyz/midl-js-core";
import { useAccounts, useDisconnect } from "@midl-xyz/midl-js-react";
import { ClipboardIcon, LogOutIcon, XIcon } from "lucide-react";
import { Stack } from "styled-system/jsx";
import { shortenAddress } from "~/shared";
import { Button } from "~/shared/ui/button";
import { Dialog } from "~/shared/ui/dialog";
import { IconButton } from "~/shared/ui/icon-button";
import { IdentIcon } from "~/shared/ui/ident-icon";
import { PurposeIcon } from "~/shared/ui/purpose-icon/PurposeIcon";

type AccountDialogProps = {
	open: boolean;
	onClose: () => void;
};

export const AccountDialog = ({ open, onClose }: AccountDialogProps) => {
	const { accounts } = useAccounts();
	const [primaryAccount] = accounts ?? [];
	const { disconnect } = useDisconnect();

	const onDisconnect = () => {
		onClose();
		disconnect();
	};

	const getPurpose = (purpose: AddressPurpose) => {
		switch (purpose) {
			case AddressPurpose.Payment: {
				return "Payment";
			}
			case AddressPurpose.Ordinals: {
				return "Runes";
			}
		}
	};

	return (
		<Dialog.Root open={open} onOpenChange={onClose} lazyMount>
			<Dialog.Backdrop />
			<Dialog.Positioner>
				<Dialog.Content>
					<Stack gap="8" p="6">
						<Stack gap="1">
							<Dialog.Title>Connected</Dialog.Title>
						</Stack>
						<Stack gap={6} direction="column" width="full" alignItems="center">
							<IdentIcon hash={primaryAccount.address} size={14} />

							<Stack gap="1" width="full" direction="column">
								{accounts?.map((it) => (
									<Stack
										key={it.address}
										gap="1"
										direction="row"
										alignItems="center"
										width="full"
									>
										<PurposeIcon purpose={it.purpose} />
										<Stack gap="1" width="full" direction="column">
											<span>{getPurpose(it.purpose)}</span>
											<span>{shortenAddress(it.address)}</span>
										</Stack>
										<IconButton variant="ghost">
											<ClipboardIcon />
										</IconButton>
									</Stack>
								))}
							</Stack>

							<Button variant="outline" width="full" onClick={onDisconnect}>
								<LogOutIcon />
								Disconnect
							</Button>
						</Stack>
					</Stack>
					<Dialog.CloseTrigger asChild position="absolute" top="2" right="2">
						<IconButton aria-label="Close Dialog" variant="ghost" size="sm">
							<XIcon />
						</IconButton>
					</Dialog.CloseTrigger>
				</Dialog.Content>
			</Dialog.Positioner>
		</Dialog.Root>
	);
};
