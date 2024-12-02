import { useMidlContext } from "@midl-xyz/midl-js-react";
import { useAccount } from "wagmi";

/**
 * Custom hook to increment the nonce for the current account.
 *
 * This hook provides a function to increment the nonce value associated with the connected account in the store.
 *
 * @example
 * ```typescript
 * const incrementNonce = useIncrementNonce();
 *
 * // To increment the nonce
 * incrementNonce();
 * ```
 *
 * @returns
 * - **incrementNonce**: `() => void` – Function to increment the nonce for the current account.
 */
export const useIncrementNonce = () => {
	const { store } = useMidlContext();
	const { address } = useAccount();

	return () => {
		if (!address) {
			return;
		}

		const { wallet } = store.getState();

		const nonce = wallet?.[address]?.nonce ?? 0;

		store.setState({
			wallet: {
				...wallet,
				[address]: {
					nonce: nonce + 1,
					transactions: wallet?.[address]?.transactions ?? [],
				},
			},
		});
	};
};
