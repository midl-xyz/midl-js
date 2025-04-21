"use client";

import { Portal } from "@ark-ui/react";
import { AddressPurpose } from "@midl-xyz/midl-js-core";
import { useAccounts, useDisconnect } from "@midl-xyz/midl-js-react";
import { ClipboardIcon, LogOutIcon, XIcon } from "lucide-react";
import { css } from "styled-system/css";
import { Stack } from "styled-system/jsx";
import { useClipboard } from "~/features/clipboard";
import { shortenAddress, useToaster } from "~/shared";
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
	const { disconnect } = useDisconnect({
		mutation: {
			onSuccess: onClose,
		},
	});

	const toaster = useToaster();

	const [, copyToClipboard] = useClipboard();

	const onCopyToClipboard = (address: string) => {
		copyToClipboard(address);
		toaster.info({
			title: "Copied to clipboard",
			description: "Address copied to clipboard",
			closable: true,
		});
	};

	const onDisconnect = () => {
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
		<Dialog.Root open={open} onOpenChange={onClose} unmountOnExit>
			<Dialog.Backdrop />
			<Portal>
				<Dialog.Positioner>
					<Dialog.Content>
						<Stack gap="8" p="6">
							<Stack gap="1">
								<Dialog.Title>Connected</Dialog.Title>
							</Stack>
							<Stack
								gap={6}
								direction="column"
								width="full"
								alignItems="center"
							>
								<IdentIcon hash={primaryAccount.address} size={14} />

								<Stack gap={6} width="full" direction="column">
									{accounts?.map((it) => (
										<Stack
											key={it.address}
											gap={4}
											direction="row"
											alignItems="center"
											width="full"
										>
											<PurposeIcon purpose={it.purpose} />

											<div className={css({ flex: 1 })}>
												<div
													className={css({
														fontSize: "xs",
														color: "fg.subtle",
													})}
												>
													{getPurpose(it.purpose)}
												</div>
												<div
													className={css({
														mt: "-0.25em",
													})}
												>
													{shortenAddress(it.address)}
												</div>
											</div>

											<IconButton
												variant="ghost"
												onClick={() => onCopyToClipboard(it.address)}
											>
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
			</Portal>
		</Dialog.Root>
	);
};
