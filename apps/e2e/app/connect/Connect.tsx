import { AddressPurpose } from "@midl-xyz/midl-js-core";
import { useAccounts, useConnect } from "@midl-xyz/midl-js-react";

export const Connect = () => {
	const { connect, connectors } = useConnect({
		purposes: [AddressPurpose.Ordinals],
	});

	const { ordinalsAccount } = useAccounts();

	const onClick = () => {
		connect({ id: connectors[0].id });
	};

	return (
		<>
			{ordinalsAccount?.address && (
				<p data-testid="address">Address: {ordinalsAccount.address}</p>
			)}
			{!ordinalsAccount && (
				<button type="button" data-testid="connect" onClick={onClick}>
					Connect
				</button>
			)}
		</>
	);
};
