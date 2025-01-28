import type { Account } from "~/connectors";
import { AddressPurpose } from "~/constants";
import type { Config } from "~/createConfig";

/**
 * Gets the default account from the current connection.
 * If no account is found, an error is thrown.
 *
 * If a search function is provided, the first account that matches the search function is returned.
 * In other cases, the first account with the purpose of `Ordinals` or `Payment` is returned.
 *
 * @param config The configuration object
 * @param search A search function to find the account
 * @returns The account
 */
export const getDefaultAccount = async (
	config: Config,
	search?: (account: Account) => boolean,
) => {
	if (!config.currentConnection) {
		throw new Error("No current connection");
	}

	const accounts = await config.currentConnection.getAccounts();

	if (!accounts) {
		throw new Error("No accounts found");
	}

	const paymentAccount = accounts.find(
		(it) => it.purpose === AddressPurpose.Payment,
	);

	const ordinalsAccount = accounts.find(
		(it) => it.purpose === AddressPurpose.Ordinals,
	);

	const account = search
		? accounts.find(search)
		: ordinalsAccount || paymentAccount;

	if (!account) {
		throw new Error("No account found");
	}

	return account;
};
