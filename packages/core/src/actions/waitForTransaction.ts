import { getBlockHeight } from "~/actions/getBlockHeight";
import type { Config } from "~/createConfig";

export const waitForTransaction = (
  config: Config,
  txId: string,
  confirmations = 1,
  {
    maxAttempts = 1000,
    intervalMs = 30_000,
  }: { maxAttempts?: number; intervalMs?: number } = {}
) => {
  const check = async () => {
    let confirmed = -1;
    let attempt = 0;

    while (confirmed === -1) {
      if (attempt >= maxAttempts) {
        throw new Error("Transaction not confirmed");
      }

      try {
        const response = await fetch(
          `${config.network?.rpcUrl}/tx/${txId}/status`
        );

        const data = await response.json();

        if (data.confirmed) {
          const currentBlockHeight = await getBlockHeight(config);
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

      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }

    return confirmed;
  };

  return check();
};
