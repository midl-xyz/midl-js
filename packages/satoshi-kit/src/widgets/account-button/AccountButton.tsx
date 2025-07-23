"use client";

import { useAccounts, useBalance } from "@midl-xyz/midl-js-react";
import { css } from "styled-system/css";
import { useSatoshiKit } from "~/app";
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
	const { config } = useSatoshiKit();
	const { accounts } = useAccounts({ config });
	const [primaryAccount] = accounts ?? [];
	const { balance, isLoading } = useBalance({
		address: primaryAccount.address,
		config,
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
		<Button type="button" onClick={onClick} variant="solid">
			{!hideBalance && (
				<span>
					{!isLoading ? (
						`${formatBTC(balance ?? 0)} BTC`
					) : (
						<Spinner width="1.1em" height="1.1em" />
					)}
				</span>
			)}
			{!hideAvatar && <IdentIcon hash={primaryAccount.address} />}

			{!hideAddress && shortenAddress(primaryAccount.address)}
		</Button>
	);
};
