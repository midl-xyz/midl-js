import { type Config, getDefaultAccount } from "@midl-xyz/midl-js-core";
import {
	type Address,
	type Client,
	type StateOverride,
	encodeAbiParameters,
	erc20Abi,
	keccak256,
	toHex,
} from "viem";
import { getBalance, readContract } from "viem/actions";
import { LoggerNamespace, getLogger } from "~/config";
import type { TransactionIntention } from "~/types";
import { getEVMAddress, satoshisToWei } from "~/utils";

const logger = getLogger([LoggerNamespace.Actions, "createStateOverride"]);

/**
 * Creates a state override for EVM simulation based on the provided transaction intentions.
 *
 * This function aggregates BTC and rune balances from the given intentions and prepares a state override array
 * for use in EVM simulation or testing. It updates the EVM account balance and ERC20 rune balances as needed.
 *
 * @param config - The configuration object.
 * @param client - Viem's EVM client instance.
 * @param intentions - Array of TransactionIntention objects to aggregate balances from.
 * @param fees - (Optional) BTC fees in wei (default: 1 BTC, converted to ETH units).
 * @returns A StateOverride array for EVM simulation.
 *
 * @example
 * const overrides = await createStateOverride(config, client, intentions);
 * // Use overrides in EVM simulation or testing
 */
export const createStateOverride = async (
	config: Config,
	client: Client,
	intentions: TransactionIntention[],
	fees: bigint = satoshisToWei(100000000), // 1 BTC
): Promise<StateOverride> => {
	const evmAddress = getEVMAddress(
		getDefaultAccount(config),
		config.getState().network,
	);

	const satoshis = intentions.reduce((acc, intention) => {
		return acc + (intention.deposit?.satoshis || 0);
	}, 0);

	const userBalance = await getBalance(client, {
		address: evmAddress,
	});

	const balanceOverride: StateOverride[number] = {
		address: evmAddress,
		balance: satoshisToWei(satoshis) + userBalance + fees,
	};

	logger.debug(
		"Creating state override for {evmAddress} with balance: {balanceOverride}, total deposit: {satoshis} satoshis, fees: {fees} wei, user balance: {userBalance} wei",
		{
			evmAddress,
			balanceOverride: balanceOverride.balance,
			satoshis,
			fees,
			userBalance,
		},
	);

	const overrides: StateOverride = [balanceOverride];

	const runes = intentions
		.flatMap((intention) => {
			return (
				intention.deposit?.runes?.map((rune) => ({
					address: rune.address ?? evmAddress,
					balance: rune.amount,
				})) || []
			);
		})
		.reduce(
			(acc, rune) => {
				if (!acc[rune.address]) {
					acc[rune.address] = { address: rune.address, balance: 0n };
				}
				acc[rune.address].balance += rune.balance;
				return acc;
			},
			{} as Record<string, { address: Address; balance: bigint }>,
		);

	const slot = keccak256(
		encodeAbiParameters(
			[
				{
					type: "address",
				},
				{ type: "uint256" },
			],
			[evmAddress, 0n],
		),
	);

	for (const rune of Object.values(runes)) {
		const balance = await readContract(client, {
			abi: erc20Abi,
			address: rune.address,
			args: [evmAddress],
			functionName: "balanceOf",
		});

		overrides.push({
			address: rune.address,
			stateDiff: [
				{
					slot,
					value: toHex(rune.balance + balance, { size: 32 }),
				},
			],
		});
	}

	logger.debug(
		"Created state override for {evmAddress}, overrides: {overrides}",
		{
			evmAddress,
			overrides,
		},
	);
	return overrides;
};
