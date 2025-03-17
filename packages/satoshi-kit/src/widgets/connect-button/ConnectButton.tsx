import { AddressPurpose } from "@midl-xyz/midl-js-core";
import { useAccounts, useConnect } from "@midl-xyz/midl-js-react";
import { css } from "styled-system/css";
import { Button } from "~/shared/ui/button";
import { AccountButton } from "~/widgets/account-button";

export const ConnectButton = () => {
	const { isConnected } = useAccounts();
	const { connect, connectors } = useConnect({
		purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
	});

	const onConnect = () => {
		connect({
			id: connectors[0].id,
		});
	};

	if (isConnected) {
		return <AccountButton />;
	}

	return (
		<Button onClick={onConnect} variant="subtle">
			Connect Wallet
		</Button>
	);
};
