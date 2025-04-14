import { describe, expect, it } from "vitest";
import { useEnvironment } from "../tests/useEnvironment";
import { readContract } from "viem/actions";

describe("MidlHardhatEnvironment", () => {
	useEnvironment();

	it.skip("deploys libraries", async () => {
		const {
			hre: { midl },
		} = globalThis;
		await midl.initialize();

		const LIB_BORROW_LOGIC = "BorrowLogic";
		const LIB_RESERVE_LOGIC = "ReserveLogic";
		const LIB_FLASHLOAN_LOGIC = "FlashLoanLogic";
		const FLASHLOAN_USER = "FlashLoanUser";

		await midl.deploy(LIB_BORROW_LOGIC, { args: [] });
		await midl.deploy(LIB_RESERVE_LOGIC, { args: [] });

		await midl.execute();

		await midl.initialize();

		const BorrowLogic = await midl.getDeployment(LIB_BORROW_LOGIC);
		const ReverseLogic = await midl.getDeployment(LIB_RESERVE_LOGIC);

		if (!BorrowLogic || !ReverseLogic) {
			throw new Error("BorrowLogic or ReserveLogic not found");
		}

		await midl.deploy(LIB_FLASHLOAN_LOGIC, {
			args: [],
			libraries: {
				BorrowLogic: BorrowLogic.address,
				ReserveLogic: ReverseLogic.address,
			},
		});

		await midl.execute();

		const FlashLoanLogic = await midl.getDeployment(LIB_FLASHLOAN_LOGIC);

		if (!FlashLoanLogic) {
			throw new Error("FlashLoanLogic not found");
		}

		await midl.deploy(FLASHLOAN_USER, {
			args: [],
			libraries: {
				FlashLoanLogic: FlashLoanLogic.address,
			},
		});

		await midl.execute();
		const FlashLoanUser = await midl.getDeployment(FLASHLOAN_USER);

		if (!FlashLoanUser) {
			throw new Error("FlashLoanUser not found");
		}

		const lastKnownResult = await readContract(await midl.getWalletClient(), {
			address: FlashLoanUser.address,
			abi: FlashLoanUser.abi,
			functionName: "lastFlashLoanResult",
			args: [],
		});

		console.log("lastKnownResult", lastKnownResult);

		await midl.callContract(FLASHLOAN_USER, "executeFlashLoan", {
			args: [],
		});

		await midl.execute();

		console.log(
			"new result",
			await readContract(await midl.getWalletClient(), {
				address: FlashLoanUser.address,
				abi: FlashLoanUser.abi,
				functionName: "lastFlashLoanResult",
				args: [],
			}),
		);
	});
});
