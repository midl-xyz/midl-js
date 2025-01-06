import type { TransactionRequest } from "ethers";
import type { StateOverride, TransactionSerializableBTC } from "viem";
import type { StateOverride as EthersStateOverride } from "ethers/lib.commonjs/providers/abstract-provider";

export const transformViemToEthersStateOverride = (
	stateOverride?: StateOverride,
): EthersStateOverride | undefined => {
	if (typeof stateOverride === "undefined") {
		return undefined;
	}

	const ethersStateOverride: EthersStateOverride = {};

	for (const [address, viemState] of Object.entries(stateOverride)) {
		const state: EthersStateOverride[string]["state"] = {};
		const stateDiff: EthersStateOverride[string]["stateDiff"] = {};

		if (viemState.state) {
			for (const { slot, value } of viemState.state) {
				state[slot] = value;
			}
		}

		if (viemState.stateDiff) {
			for (const { slot, value } of viemState.stateDiff) {
				stateDiff[slot] = value;
			}
		}

		ethersStateOverride[address] = {
			balance: viemState.balance,
			nonce: viemState.nonce,
			code: viemState.code,
			state,
			stateDiff,
		};
	}

	return ethersStateOverride;
};

export const transformViemToEthersTx = ({
	accessList,
	type,
	...tx
}: TransactionSerializableBTC): TransactionRequest => {
	return {
		...tx,
		accessList: accessList
			? accessList.map(({ address, storageKeys }) => ({
					address,
					storageKeys: storageKeys.map((key) => key.toString()),
				}))
			: undefined,
		type: type === "btc" ? 7 : type,
	};
};
