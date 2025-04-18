"use client";

import { useAccounts, useBalance } from "@midl-xyz/midl-js-react";
import { css } from "styled-system/css";
import { formatBTC, shortenAddress } from "~/shared";
import { Button } from "~/shared/ui/button";
import { IdentIcon } from "~/shared/ui/ident-icon";
import { Spinner } from "~/shared/ui/spinner";

type AccountButtonProps = {
	hideBalance?: boolean;
	hideAvatar?: boolean;
	hideAddress?: boolean;
	onClick?: () => void;
	children?: ({
		balance,
		address,
	}: {
		balance: number;
		address: string;
	}) => React.ReactNode;
};

export const AccountButton = ({
	hideBalance = false,
	hideAddress = false,
	hideAvatar = false,
	onClick,
	children,
}: AccountButtonProps) => {
	const { accounts } = useAccounts();
	const [primaryAccount] = accounts ?? [];
	const { balance } = useBalance({
		address: primaryAccount.address,
		query: {
			enabled: Boolean(primaryAccount.address) && !hideBalance,
		},
	});

	if (children) {
		return children({
			balance,
			address: primaryAccount.address,
		});
	}

	return (
		<Button
			type="button"
			className={css({
				display: "flex",
				alignItems: "center",
				background: "zinc.950",
				color: "zinc.100",
				px: 6,
				py: 3,
				borderRadius: "md",
				gap: 3,
				fontSize: "md",
				fontWeight: "bold",
				cursor: "pointer",
			})}
			onClick={onClick}
		>
			{!hideBalance && (
				<span>
					{balance ? (
						`${formatBTC(balance)} BTC`
					) : (
						<Spinner
							width="1.1em"
							height="1.1em"
							borderWidth="1.5px"
							borderTopColor="fg.disabled"
							borderRightColor="fg.disabled"
						/>
					)}
				</span>
			)}
			{!hideAvatar && <IdentIcon hash={primaryAccount.address} />}

			{!hideAddress && shortenAddress(primaryAccount.address)}
		</Button>
	);
};
