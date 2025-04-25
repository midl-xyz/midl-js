import { AddressPurpose } from "@midl-xyz/midl-js-core";
import { usePublicKey } from "@midl-xyz/midl-js-executor-react";
import {
	useAccounts,
	useConnect,
	useDisconnect,
} from "@midl-xyz/midl-js-react";
import { useState } from "react";

export const Connect = () => {
	const [purposes, setPurposes] = useState<AddressPurpose[]>([
		AddressPurpose.Ordinals,
	]);

	const { connect, connectors, error } = useConnect({
		purposes,
	});

	console.error(error);

	const { disconnect } = useDisconnect();

	const { paymentAccount, ordinalsAccount } = useAccounts();
	const publicKey = usePublicKey();

	const onClick = () => {
		connect({ id: connectors[0].id });
	};

	return (
		<>
			{!ordinalsAccount && (
				<>
					<label>
						<input
							type="checkbox"
							checked={purposes.includes(AddressPurpose.Payment)}
							onChange={() =>
								setPurposes((prev) =>
									prev.includes(AddressPurpose.Payment)
										? prev.filter((p) => p !== AddressPurpose.Payment)
										: [...prev, AddressPurpose.Payment],
								)
							}
						/>
						Connect for Payment
					</label>

					<button type="button" data-testid="connect" onClick={onClick}>
						Connect
					</button>
				</>
			)}
			{publicKey && <p data-testid="public-key">Public Key: {publicKey}</p>}

			{ordinalsAccount?.address && (
				<p data-testid="address">
					Address: {paymentAccount?.address ?? ordinalsAccount?.address}
				</p>
			)}

			<button
				type="button"
				data-testid="disconnect"
				onClick={() => {
					disconnect();
				}}
			>
				Disconnect
			</button>
		</>
	);
};
