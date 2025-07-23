"use client";

import { Portal } from "@ark-ui/react";
import { useConnect, useDisconnect } from "@midl-xyz/midl-js-react";
import { ArrowLeftIcon, XIcon } from "lucide-react";
import { css } from "styled-system/css";
import { Flex, Grid, Stack } from "styled-system/jsx";
import { useSatoshiKit } from "~/app";
import { useAuthentication } from "~/features/auth/api";
import { Button } from "~/shared/ui/button";
import { Dialog } from "~/shared/ui/dialog";
import { ErrorIcon } from "~/shared/ui/error-icon";
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
					<Dialog.Content maxW="600px" display="flex" overflow="hidden">
						<Grid
							gridTemplateColumns="1fr 1fr"
							gap={0}
							w="full"
							height="100vh"
							maxH="460px"
						>
							<Stack h="full" overflow="hidden">
								<Flex
									gap="1"
									justifyContent="space-between"
									flexShrink={0}
									p={4}
								>
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
									flexGrow={1}
									overflowY="auto"
									height="full"
									className={css({
										containerType: "inline-size",
									})}
								>
									{!error && !isPending && !isAuthenticating && (
										<ConnectorList onClick={(id) => connect({ id })} />
									)}

									{(isPending || isAuthenticating) && (
										<Stack
											gap={2}
											px={4}
											direction="column"
											width="full"
											alignItems="center"
										>
											<IconButton
												variant="ghost"
												onClick={() => reset()}
												alignSelf="start"
												size="sm"
											>
												<ArrowLeftIcon />
											</IconButton>

											<Stack
												alignItems={"center"}
												justifyContent={"center"}
												paddingTop={14}
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

												<Text textStyle="lg" textAlign="center">
													Opening{" "}
													{
														connectors?.find((it) => it.id === variables?.id)
															?.metadata.name
													}
													...
												</Text>
											</Stack>

											<Flex px={12} textAlign="center">
												<Text textStyle="md">
													{isAuthenticating
														? "Confirm signature in your wallet"
														: "Confirm connection in your wallet"}
												</Text>
											</Flex>

											<Spinner width="6" height="6" />
										</Stack>
									)}

									{error && !isPending && !isAuthenticating && (
										<Stack
											gap={4}
											px={4}
											direction="column"
											width="full"
											alignItems="center"
										>
											<IconButton
												variant="ghost"
												onClick={() => reset()}
												alignSelf="start"
												size="sm"
											>
												<ArrowLeftIcon />
											</IconButton>

											<Stack
												alignItems={"center"}
												justifyContent={"center"}
												paddingTop={14}
												gap={0}
											>
												<ErrorIcon
													className={css({
														width: "4em",
														height: "4em",
													})}
												/>

												<Text textStyle="md" textAlign="center">
													Failed to connect to{" "}
													{
														connectors?.find((it) => it.id === variables?.id)
															?.metadata.name
													}
												</Text>
												<Text textStyle="xs" px={3} textAlign="center">
													{error.message ||
														"Please try again or choose another wallet"}
												</Text>
											</Stack>

											<Button
												variant="solid"
												size="sm"
												onClick={() => {
													reset();
													connect({ id: variables?.id });
												}}
											>
												Retry
											</Button>
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
