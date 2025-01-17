import { getBlockNumber } from "~/actions/getBlockNumber";
import type { Config } from "~/createConfig";
import axios from "axios";

export const waitForTransaction = (
	config: Config,
	txId: string,
	confirmations = 1,
	{
		maxAttempts = 1000,
		intervalMs = 30_000,
	}: { maxAttempts?: number; intervalMs?: number } = {},
) => {
	const check = async () => {
		let confirmed = -1;
		let attempt = 0;

		while (confirmed === -1) {
			if (attempt >= maxAttempts) {
				throw new Error("Transaction not confirmed");
			}

			try {
				const { data } = await axios<{
					confirmed: boolean;
					block_height: number;
				}>(`${config.network?.rpcUrl}/tx/${txId}/status`);

				if (data.confirmed) {
					const currentBlockHeight = await getBlockNumber(config);
					const currentConfirmations =
						currentBlockHeight - data.block_height + 1;

					if (currentConfirmations >= confirmations) {
						confirmed = currentConfirmations;
						break;
					}
				}
			} catch (error) {
				console.error(error);
			}

			attempt += 1;

			await new Promise((resolve) => setTimeout(resolve, intervalMs));
		}

		return confirmed;
	};

	return check();
};
