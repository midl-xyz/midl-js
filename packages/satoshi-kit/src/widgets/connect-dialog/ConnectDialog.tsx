import { useConnect } from "@midl-xyz/midl-js-react";
import { ArrowRightIcon, XIcon } from "lucide-react";
import { css } from "styled-system/css";
import { Stack } from "styled-system/jsx";
import { useSatoshiKit } from "~/app";
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
	const { purposes } = useSatoshiKit();

	const { connect, connectors, isPending } = useConnect({
		purposes,
		mutation: {
			onError: (error) => {
				console.error(error);
			},
		},
	});

	return (
		<Dialog.Root open={open} onOpenChange={onClose} unmountOnExit lazyMount>
			<Dialog.Backdrop />
			<Dialog.Positioner>
				<Dialog.Content>
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

					{!isPending && (
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

										{it.name}

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
		</Dialog.Root>
	);
};
