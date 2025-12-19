import { getBlockNumber } from "~/actions/getBlockNumber";
import type { Config } from "~/createConfig";

/**
 * Waits for a transaction to be confirmed
 *
 * @example
 * ```ts
 * const confirmations = await waitForTransaction(config, "txid", 1);
 * console.log(confirmations);
 * ```
 *
 * @param config The configuration object
 * @param txId The transaction ID
 * @param confirmations The number of confirmations to wait for
 * @param params The parameters for the request
 * @returns The number of confirmations
 */
export const waitForTransaction = async (
	config: Config,
	txId: string,
	confirmations = 1,
	{
		maxAttempts = 1000,
		intervalMs = 30_000,
	}: {
		/**
		 * The maximum number of attempts
		 */
		maxAttempts?: number;
		/**
		 * The interval in milliseconds
		 */
		intervalMs?: number;
	} = {},
) => {
	const { network, provider } = config.getState();

	if ("waitForTransaction" in provider && provider.waitForTransaction) {
		return await provider.waitForTransaction(network, txId, confirmations, {
			timeoutMs: intervalMs * maxAttempts,
		});
	}

	const check = async () => {
		let confirmed = -1;
		let attempt = 0;

		while (confirmed === -1) {
			if (attempt >= maxAttempts) {
				throw new Error("Transaction not confirmed");
			}

			try {
				const data = await provider.getTransactionStatus(network, txId);

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
