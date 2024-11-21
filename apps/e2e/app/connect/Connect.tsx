import { AddressPurpose } from "@midl-xyz/midl-js-core";
import { usePublicKey } from "@midl-xyz/midl-js-executor";
import { useAccounts, useConnect } from "@midl-xyz/midl-js-react";

export const Connect = () => {
	const { connect, connectors } = useConnect({
		purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
	});

	const { paymentAccount, ordinalsAccount } = useAccounts();
	const publicKey = usePublicKey();

	const onClick = () => {
		connect({ id: connectors[0].id });
	};

	return (
		<>
			{publicKey && <p data-testid="public-key">Public Key: {publicKey}</p>}
			{ordinalsAccount?.address && (
				<p data-testid="address">
					Address: {paymentAccount?.address ?? ordinalsAccount?.address}
				</p>
			)}
			{!ordinalsAccount && (
				<button type="button" data-testid="connect" onClick={onClick}>
					Connect
				</button>
			)}
		</>
	);
};
