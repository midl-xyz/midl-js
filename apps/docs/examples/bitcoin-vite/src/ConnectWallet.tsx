import { AddressPurpose } from "@midl-xyz/midl-js-core";
import { useConnect } from "@midl-xyz/midl-js-react";

export function ConnectWallet() {
	const { connectors, connect } = useConnect({
		purposes: [AddressPurpose.Ordinals],
	});

	return (
		<div>
			{connectors.map((connector) => (
				<button
					type="button"
					key={connector.name}
					onClick={() => connect({ id: connector.id })}
				>
					Connect with {connector.name}
				</button>
			))}
		</div>
	);
}
