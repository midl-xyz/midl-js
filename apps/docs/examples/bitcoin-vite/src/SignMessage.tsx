import { SignMessageProtocol } from "@midl-xyz/midl-js-core";
import { useAccounts, useSignMessage } from "@midl-xyz/midl-js-react";

export function SignMessage() {
	const { signMessage, data } = useSignMessage();
	const { ordinalsAccount } = useAccounts();

	const sign = () => {
		signMessage({
			message: "Hello, world!",
			protocol: SignMessageProtocol.Bip322,
			address: ordinalsAccount?.address,
		});
	};

	return (
		<div>
			<button type="button" onClick={sign}>
				Sign Message
			</button>

			{data && (
				<div>
					<code>{JSON.stringify(data, null, 2)}</code>
				</div>
			)}
		</div>
	);
}
