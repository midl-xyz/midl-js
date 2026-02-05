import {
	EmptyAccountsError,
	WalletConnectionError,
} from "~/actions/connect.js";
import type { Account } from "~/connectors/index.js";
import { AddressPurpose } from "~/constants/index.js";
import type { Config } from "~/createConfig.js";

class PredicateError extends Error {
	constructor(msg: string) {
		super(msg);
		this.name = "PredicateError";
	}
}
/**
 * Gets the default account from the current connection.
 *
 * The selection order is:
 * 1. If a predicate is provided, returns the first account matching the predicate.
 * 2. If a defaultPurpose is set, returns the first account with that purpose.
 * 3. Otherwise, returns the first account with the purpose of `Payment`, or if not found, `Ordinals`.
 *
 * @param config - The configuration object.
 * @param predicate - (Optional) A function to search for a specific account. Receives an account and returns a boolean.
 *
 * @returns The selected account.
 *
 * @throws {WalletConnectionError} If there is no active connection.
 * @throws {EmptyAccountsError} If there are no accounts.
 * @throws {PredicateError} If a predicate is provided and no account matches.
 *
 * @example
 * ```typescript
 * const account = getDefaultAccount(config, acc => acc.address === 'bcrt1q...');
 * ```
 */
export const getDefaultAccount = (
	config: Config,
	predicate?: (account: Account) => boolean,
) => {
	const { connection, accounts, defaultPurpose } = config.getState();

	if (!connection) {
		throw new WalletConnectionError();
	}

	if (!accounts || accounts.length === 0) {
		throw new EmptyAccountsError();
	}

	const paymentAccount = accounts.find(
		(it) => it.purpose === AddressPurpose.Payment,
	);

	const ordinalsAccount = accounts.find(
		(it) => it.purpose === AddressPurpose.Ordinals,
	);

	let account = paymentAccount || ordinalsAccount;

	if (defaultPurpose) {
		account = accounts.find((it) => it.purpose === defaultPurpose);
	}

	if (predicate) {
		account = accounts.find(predicate);
	}

	if (!account && predicate) {
		throw new PredicateError("No account found matching the predicate");
	}

	return account as Account;
};
