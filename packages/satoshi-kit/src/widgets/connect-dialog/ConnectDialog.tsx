"use client";

import { Portal } from "@ark-ui/react";
import { useConnect, useDisconnect } from "@midl-xyz/midl-js-react";
import { XIcon } from "lucide-react";
import { css } from "styled-system/css";
import { Flex, Grid, Stack } from "styled-system/jsx";
import { useSatoshiKit } from "~/app";
import { useAuthentication } from "~/features/auth/api";
import { Dialog } from "~/shared/ui/dialog";
import { IconButton } from "~/shared/ui/icon-button";
import { Spinner } from "~/shared/ui/spinner";
import { Text } from "~/shared/ui/text";
import { WalletIcon } from "~/shared/ui/wallet-icons";
import { About } from "~/widgets/about";
import { ConnectorList } from "~/widgets/connector-list";

type ConnectDialogProps = {
	open: boolean;
	onClose: () => void;
};

export const ConnectDialog = ({ open, onClose }: ConnectDialogProps) => {
	const { purposes, config } = useSatoshiKit();
	const { disconnect } = useDisconnect({ config });

	const { adapter, signInAsync, signInState, signOutState } = useAuthentication(
		{
			signInMutation: {
				onSuccess: onClose,
				onError: () => {
					disconnect();
				},
			},
		},
	);

	const { connect, variables, connectors, isPending, isSuccess, reset, error } =
		useConnect({
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
					<Dialog.Content maxW="600px" display="flex">
						<Grid gridTemplateColumns="1fr 1fr" gap={0} w="full">
							<Stack maxH="400px">
								<Flex gap="1" justifyContent="space-between" p={4}>
									<Dialog.Title textStyle="subtitle">
										Connect Wallet
									</Dialog.Title>
									<Dialog.CloseTrigger asChild>
										<IconButton
											aria-label="Close Dialog"
											variant="ghost"
											size="sm"
										>
											<XIcon />
										</IconButton>
									</Dialog.CloseTrigger>
								</Flex>

								<Flex
									h="full"
									overflowY="auto"
									className={css({
										containerType: "inline-size",
									})}
								>
									{!isPending && !isAuthenticating && (
										<ConnectorList onClick={(id) => connect({ id })} />
									)}

									{(isPending || isAuthenticating) && (
										<Stack
											gap={8}
											p={6}
											direction="column"
											width="full"
											alignItems="center"
											pt={12}
										>
											{variables?.id && (
												<WalletIcon
													connectorId={variables.id}
													size={8}
													className={css({
														width: 10,
														height: 10,
													})}
												/>
											)}

											<Flex>
												<Text textStyle="md">
													{isAuthenticating
														? "Authenticating..."
														: "Waiting for wallet connection..."}
												</Text>
											</Flex>

											<Spinner width="6" height="6" />
										</Stack>
									)}
								</Flex>
							</Stack>
							<Flex width="full">
								<About />
							</Flex>
						</Grid>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
};
