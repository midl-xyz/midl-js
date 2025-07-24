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
import type { TransactionIntention } from "~/types";
import { convertBTCtoETH, getEVMAddress } from "~/utils";

export const createStateOverride = async (
	config: Config,
	client: Client,
	intentions: TransactionIntention[],
): Promise<StateOverride> => {
	const evmAddress = getEVMAddress(config, getDefaultAccount(config));

	const satoshis = intentions.reduce((acc, intention) => {
		return acc + (intention.satoshis || 0);
	}, 0);

	const userBalance = await getBalance(client, {
		address: evmAddress,
	});

	const balanceOverride: StateOverride[number] = {
		address: evmAddress,
		balance: convertBTCtoETH(satoshis) + userBalance,
	};

	const overrides: StateOverride = [balanceOverride];

	const runes = intentions
		.flatMap((intention) => {
			return (
				intention.runes?.map((rune) => ({
					address: rune.address ?? evmAddress,
					balance: rune.value,
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

	return overrides;
};
