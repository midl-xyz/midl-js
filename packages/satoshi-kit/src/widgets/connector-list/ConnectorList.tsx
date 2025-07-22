import { useConfig, useConnect } from "@midl-xyz/midl-js-react";
import { ArrowRightIcon } from "lucide-react";
import { css } from "styled-system/css";
import { Stack } from "styled-system/jsx";
import { Button } from "~/shared/ui/button";
import { VerifiedIcon } from "~/shared/ui/verified-icon";
import { WalletIcon } from "~/shared/ui/wallet-icons";

type Props = {
	onClick: (id: string) => void;
};

export const ConnectorList = ({ onClick }: Props) => {
	const { connectors } = useConfig();

	return (
		<Stack gap={2} direction="column" w="full">
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
	);
};
