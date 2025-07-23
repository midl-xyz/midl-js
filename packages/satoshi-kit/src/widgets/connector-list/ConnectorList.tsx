import { useConfig, useConnect } from "@midl-xyz/midl-js-react";
import { ArrowRightIcon } from "lucide-react";
import { css } from "styled-system/css";
import { Stack } from "styled-system/jsx";
import { a } from "vitest/dist/chunks/suite.d.FvehnV49.js";
import { Button } from "~/shared/ui/button";
import { Text } from "~/shared/ui/text";
import { VerifiedIcon } from "~/shared/ui/verified-icon";
import { WalletIcon } from "~/shared/ui/wallet-icons";

type Props = {
	onClick: (id: string) => void;
};

export const ConnectorList = ({ onClick }: Props) => {
	const { connectors } = useConfig();

	const groupedConnectors = connectors.reduce(
		(acc, connector) => {
			const group = connector.metadata.group || "more";
			if (!acc[group]) {
				acc[group] = [];
			}
			acc[group].push(connector);
			acc[group].sort((a) => (a.metadata.isPartner ? -1 : 1));

			return acc;
		},
		{} as Record<string, typeof connectors>,
	);

	return (
		<Stack gap={4} direction="column" w="full">
			{Object.entries(groupedConnectors).map(([group, connectors]) => (
				<Stack key={group} gap={2} direction="column" w="full">
					{connectors.length > 0 && (
						<Stack
							direction="row"
							alignItems="center"
							justifyContent="space-between"
							color="text.muted"
							px={4}
						>
							<Text textStyle="md" textTransform="capitalize">
								{group}
							</Text>
						</Stack>
					)}

					<Stack gap={1} direction="column" w="full">
						{connectors.map((it) => (
							<Button
								width="full"
								variant="ghost"
								borderRadius="0"
								key={it.id}
								onClick={() => onClick(it.id)}
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
										alignItems: "start",
										flexDirection: "column",
									})}
								>
									<span>{it.metadata.name}</span>

									{it.metadata.isPartner && (
										<span
											className={css({
												display: "flex",
												alignItems: "center",
												gap: 1,
											})}
										>
											<VerifiedIcon
												className={css({
													height: "1em",
													width: "1em",
												})}
											/>
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
				</Stack>
			))}
		</Stack>
	);
};
