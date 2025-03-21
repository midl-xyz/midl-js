import { useAccounts, useBalance } from "@midl-xyz/midl-js-react";
import { useState } from "react";
import { css } from "styled-system/css";
import { formatBTC, shortenAddress } from "~/shared";
import { Button } from "~/shared/ui/button";
import { IdentIcon } from "~/shared/ui/ident-icon";
import { Spinner } from "~/shared/ui/spinner";
import { AccountDialog } from "~/widgets/account-dialog";

type AccountButtonProps = {
	hideBalance?: boolean;
};

export const AccountButton = ({ hideBalance = false }: AccountButtonProps) => {
	const { accounts } = useAccounts();
	const [primaryAccount] = accounts ?? [];
	const { balance } = useBalance({
		address: primaryAccount.address,
		query: {
			enabled: Boolean(primaryAccount.address) && !hideBalance,
		},
	});

	const [open, setOpen] = useState(false);

	return (
		<>
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
				onClick={() => setOpen(true)}
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
				<IdentIcon hash={primaryAccount.address} />
				{shortenAddress(primaryAccount.address)}
			</Button>

			<AccountDialog open={open} onClose={() => setOpen(false)} />
		</>
	);
};
