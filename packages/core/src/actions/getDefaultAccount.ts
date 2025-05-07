import { EmptyAccountsError, WalletConnectionError } from "~/actions/connect";
import type { Account } from "~/connectors";
import { AddressPurpose } from "~/constants";
import type { Config } from "~/createConfig";

class PredicateError extends Error {
	constructor(msg: string) {
		super(msg);
		this.name = "PredicateError";
	}
}
/**
 * Gets the default account from the current connection.
 * If no account is found, an error is thrown.
 *
 * If a search function is provided, the first account that matches the search function is returned.
 * In other cases, the first account with the purpose of `Ordinals` or `Payment` is returned.
 *
 * @param config The configuration object
 * @param predicate A search function to find the account
 * @returns The account
 */
export const getDefaultAccount = async (
	config: Config,
	predicate?: (account: Account) => boolean,
) => {
	const { connection, accounts } = config.getState();

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

	const account = predicate
		? accounts.find(predicate)
		: ordinalsAccount || paymentAccount;

	if (!account && predicate) {
		throw new PredicateError("No account found matching the predicate");
	}

	return account as Account;
};
