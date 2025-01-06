import type { Account } from "~/connectors";
import { AddressPurpose } from "~/constants";
import type { Config } from "~/createConfig";

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
