"use client";

import { Portal } from "@ark-ui/react";
import { useConnect, useDisconnect } from "@midl-xyz/midl-js-react";
import { ArrowRightIcon, XIcon } from "lucide-react";
import { css } from "styled-system/css";
import { Stack } from "styled-system/jsx";
import { useSatoshiKit } from "~/app";
import { useAuthentication } from "~/features/auth/api";
import { useToaster } from "~/shared";
import { Button } from "~/shared/ui/button";
import { Dialog } from "~/shared/ui/dialog";
import { IconButton } from "~/shared/ui/icon-button";
import { Spinner } from "~/shared/ui/spinner";
import { WalletIcon } from "~/shared/ui/wallet-icons";

type ConnectDialogProps = {
	open: boolean;
	onClose: () => void;
};

export const ConnectDialog = ({ open, onClose }: ConnectDialogProps) => {
	const { purposes, config } = useSatoshiKit();
	const { disconnect } = useDisconnect({ config });
	const toaster = useToaster();

	const { adapter, signInAsync, signInState, signOutState } = useAuthentication(
		{
			signInMutation: {
				onSuccess: onClose,
				onError: (error) => {
					toaster.error({
						title: "Authentication failed",
						description: error.message,
					});
					console.error(error);

					disconnect();
					onClose();
				},
			},
		},
	);

	const { connect, connectors, isPending, isSuccess, reset } = useConnect({
		purposes,
		config,
		mutation: {
			onSuccess: async (accounts) => {
				if (!adapter) {
					return onClose();
				}

				const [account] = accounts;

				await signInAsync(account.address);
			},
			onError: (error) => {
				toaster.error({
					title: "Authentication failed",
					description: error.message,
				});
				console.error(error);
			},
		},
	});

	const isAuthenticating = (isSuccess && adapter) || signInState.isPending;

	return (
		<Dialog.Root
			open={open}
			onOpenChange={onClose}
			unmountOnExit
			lazyMount
			onExitComplete={() => {
				reset();
				signInState.reset();
				signOutState.reset();
			}}
		>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						{isAuthenticating && (
							<Stack
								gap={8}
								p={6}
								direction="column"
								width="full"
								alignItems="center"
								pt={12}
							>
								<Spinner
									width="12"
									height="12"
									borderWidth="1.5px"
									borderTopColor="fg.disabled"
									borderRightColor="fg.disabled"
								/>

								<p>Waiting for authentication...</p>
							</Stack>
						)}

						{isPending && (
							<Stack
								gap={8}
								p={6}
								direction="column"
								width="full"
								alignItems="center"
								pt={12}
							>
								<Spinner
									width="12"
									height="12"
									borderWidth="1.5px"
									borderTopColor="fg.disabled"
									borderRightColor="fg.disabled"
								/>

								<p>Waiting for wallet connection...</p>
							</Stack>
						)}

						{!isPending && !isAuthenticating && (
							<Stack gap="8" p="6">
								<Stack gap="1">
									<Dialog.Title>Connect Wallet</Dialog.Title>
								</Stack>
								<Stack gap={2} direction="column" width="full">
									{connectors.map((it) => (
										<Button
											width="full"
											variant="ghost"
											key={it.id}
											onClick={() =>
												connect({
													id: it.id,
												})
											}
											className={css({
												display: "flex",
												justifyContent: "flex-start",
												px: 4,
												py: 8,
											})}
										>
											<WalletIcon
												connectorId={it.id}
												size={8}
												className={css({
													width: 8,
													height: 8,
												})}
											/>

											{it.metadata.name}

											<ArrowRightIcon
												className={css({
													marginLeft: "auto",
												})}
											/>
										</Button>
									))}
								</Stack>
							</Stack>
						)}
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
