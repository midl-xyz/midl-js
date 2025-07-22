"use client";

import { Portal } from "@ark-ui/react";
import { useConnect, useDisconnect } from "@midl-xyz/midl-js-react";
import { ArrowRightIcon, XIcon } from "lucide-react";
import { css } from "styled-system/css";
import { Flex, Grid, Stack } from "styled-system/jsx";
import { useSatoshiKit } from "~/app";
import { useAuthentication } from "~/features/auth/api";
import { Button } from "~/shared/ui/button";
import { Dialog } from "~/shared/ui/dialog";
import { IconButton } from "~/shared/ui/icon-button";
import { Spinner } from "~/shared/ui/spinner";
import { Text } from "~/shared/ui/text";
import { VerifiedIcon } from "~/shared/ui/verified-icon";
import { WalletIcon } from "~/shared/ui/wallet-icons";
import { About } from "~/widgets/about";

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
					<Dialog.Content overflow="hidden" maxW="600px">
						<Grid gridTemplateColumns="1fr 1fr" gap={0}>
							<Stack>
								<Flex gap="1" justifyContent="space-between" px={4} py={6}>
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

								{!isPending && !isAuthenticating && (
									<Stack gap={2} direction="column">
										{connectors.map((it) => (
											<Button
												width="full"
												variant="ghost"
												borderRadius="0"
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
														width: 10,
														height: 10,
													})}
												/>

												<span
													className={css({
														display: "flex",
														alignItems: "center",
														flexDirection: "column",
													})}
												>
													{it.metadata.name}

													{it.metadata.isPartner && (
														<span
															className={css({
																display: "flex",
																alignItems: "center",
															})}
														>
															<VerifiedIcon />
															Partner
														</span>
													)}
												</span>

												<ArrowRightIcon
													className={css({
														marginLeft: "auto",
													})}
												/>
											</Button>
										))}
									</Stack>
								)}
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
