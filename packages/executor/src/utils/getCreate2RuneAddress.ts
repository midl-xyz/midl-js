import {
	type Address,
	encodePacked,
	getContractAddress,
	keccak256,
	toBytes,
} from "viem";
import { SystemContracts } from "~/config";
import { runeIdToBytes32 } from "~/utils";

export const getCreate2RuneAddress = (runeId: string): Address => {
	const salt = keccak256(encodePacked(["bytes32"], [runeIdToBytes32(runeId)]));
	const bytecode: `0x${string}` = `0x3d602d80600a3d3981f3363d3d373d3d3d363d73${SystemContracts.RuneImplementation.slice(2)}5af43d82803e903d91602b57fd5bf3`;

	return getContractAddress({
		opcode: "CREATE2",
		from: SystemContracts.Executor,
		salt,
		bytecode,
	});
};
