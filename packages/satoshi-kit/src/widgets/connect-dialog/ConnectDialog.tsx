"use client";

import { Portal } from "@ark-ui/react";
import { AddressPurpose } from "@midl-xyz/midl-js-core";
import { useConnect, useDisconnect } from "@midl-xyz/midl-js-react";
import { useMutation } from "@tanstack/react-query";
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
	beforeConnect?: (id: string) => Promise<void> | void;
};

export const ConnectDialog = ({
	open,
	onClose,
	beforeConnect,
}: ConnectDialogProps) => {
	const { purposes, config } = useSatoshiKit();
	const { disconnect } = useDisconnect({ config });
	const { mutateAsync: mutateBeforeConnect, ...beforeConnectState } =
		useMutation({
			mutationFn: async (id: string) => {
				if (beforeConnect) {
					return beforeConnect(id);
				}

				return true;
			},
		});

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

	const {
		connect,
		variables,
		connectors,
		isPending,
		isSuccess,
		reset,
		error: connectError,
	} = useConnect({
		purposes,
		config,
		mutation: {
			onSuccess: async (accounts) => {
				if (!adapter) {
					return onClose();
				}

				const { defaultPurpose } = config.getState();

				const paymentAccount = accounts.find(
					(it) => it.purpose === AddressPurpose.Payment,
				);

				const ordinalsAccount = accounts.find(
					(it) => it.purpose === AddressPurpose.Ordinals,
				);

				let account = paymentAccount || ordinalsAccount;

				if (defaultPurpose) {
					account = accounts.find((it) => it.purpose === defaultPurpose);
				}

				if (!account) {
					throw new Error("No account found");
				}

				await signInAsync(account);
			},
		},
	});

	const handleConnect = async (id: string) => {
		try {
			if (beforeConnect) {
				await mutateBeforeConnect(id);
			}
			connect({ id });
		} catch {}
	};

	const isAuthenticating = (isSuccess && adapter) || signInState.isPending;

	const error = signInState.error || beforeConnectState.error || connectError;

	if (error) {
		console.error("ConnectDialog error:", error);
	}

	const connectorId = beforeConnectState?.variables || variables?.id;

	return (
		<Dialog.Root
			open={open}
			onOpenChange={onClose}
			unmountOnExit
			lazyMount
			onExitComplete={() => {
				reset();
				beforeConnectState.reset();
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
									{!error &&
										!isPending &&
										!isAuthenticating &&
										!beforeConnectState.isPending && (
											<ConnectorList
												onClick={handleConnect}
												connectors={connectors}
											/>
										)}

									{(isPending ||
										isAuthenticating ||
										beforeConnectState.isPending) && (
										<Stack
											gap={2}
											px={4}
											direction="column"
											width="full"
											alignItems="center"
										>
											<IconButton
												variant="ghost"
												onClick={() => {
													signInState.reset();
													beforeConnectState.reset();
													reset();
												}}
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
												{connectorId && (
													<WalletIcon
														connectorId={connectorId}
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
														connectors?.find((it) => it.id === connectorId)
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

									{error &&
										!isPending &&
										!isAuthenticating &&
										!beforeConnectState.isPending && (
											<Stack
												gap={4}
												px={4}
												direction="column"
												width="full"
												alignItems="center"
											>
												<IconButton
													variant="ghost"
													onClick={() => {
														signInState.reset();
														beforeConnectState.reset();
														reset();
													}}
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
															connectors?.find((it) => it.id === connectorId)
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
														beforeConnectState.reset();
														reset();
														if (connectorId) {
															handleConnect(connectorId);
														}
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
