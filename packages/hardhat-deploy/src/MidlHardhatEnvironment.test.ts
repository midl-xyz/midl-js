import { describe, expect, it } from "vitest";
import { useEnvironment } from "../tests/useEnvironment";
import { getTransactionReceipt, readContract } from "viem/actions";
import { getEVMAddress } from "@midl-xyz/midl-js-executor";
import { type Address, getAddress, zeroAddress } from "viem";

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

	it.skip("works with struct", async () => {
		const {
			hre: { midl },
		} = globalThis;
		await midl.initialize();

		await midl.deploy("StructFunctionParam", { args: [] });
		await midl.execute();

		const deployer = midl.wallet.getEVMAddress();

		await midl.initialize();
		await midl.callContract("StructFunctionParam", "foo", {
			args: [
				[
					{
						first: "hello",
						second: 2,
						third: deployer,
					},
				],
			],
		});

		await midl.execute();
	});

	it.skip("deploys Foo", async () => {
		const {
			hre: { midl },
		} = globalThis;
		await midl.initialize();

		await midl.deploy("Foo", { args: [] });
		await midl.execute();

		await midl.initialize();

		await midl.callContract("Foo", "initReserves", {
			args: [
				[
					{
						aTokenImpl: "0xB4295B02798b636D284dF45ef47fa464eB372734",
						stableDebtTokenImpl: "0xc3e77541944d2fF9918C969D83d4D3d13aaF3A45",
						variableDebtTokenImpl: "0x5C6A9f1F6A3669B878581f515A1F9aC1a1248149",
						underlyingAssetDecimals: 18,
						interestRateStrategyAddress:
							"0x6680b51829BD0a0481bb77c4A3c673c2192bAf01",
						underlyingAsset: "0xcD2bcB2517F05d427692F0084ae2a4751822DfEe",
						treasury: "0x83868F040274Cbb6a1256cBE26CdB7316252d690",
						incentivesController: "0x41335c8E920dc62f2469dbaB285e040D0cd8940F",
						aTokenName: "Helios Htoken WETH",
						aTokenSymbol: "hHWETH",
						variableDebtTokenName: "Helios Variable WETH",
						variableDebtTokenSymbol: "vdHWETH",
						stableDebtTokenName: "Helios Stable WETH",
						stableDebtTokenSymbol: "sdHWETH",
						params: "0x10",
					},
				],
			],
			gas: BigInt(10000000),
			to: "0xff2BdE9960f3C2904F6A0085D669DA866f4EDDEC",
		});

		await midl.execute({ skipEstimateGasMulti: true });
	});

	it("changes account", async () => {
		const {
			hre: { midl },
		} = globalThis;

		await midl.initialize();

		const prevConfig = midl.getConfig();

		await midl.initialize(1);

		const newConfig = midl.getConfig();

		expect(newConfig).not.toEqual(prevConfig);

		expect(
			getEVMAddress(
				(prevConfig?.getState().accounts?.[0].publicKey as Address) ??
					zeroAddress,
			),
		).not.toEqual(
			getEVMAddress(
				(newConfig?.getState().accounts?.[0].publicKey as Address) ??
					zeroAddress,
			),
		);
	});

	it.skip("return correct evm address", async () => {
		const {
			hre: { midl },
		} = globalThis;

		await midl.initialize();

		const evmAddress = midl.wallet.getEVMAddress();

		await midl.deploy("StructFunctionParam", { args: [] });
		await midl.execute();

		const deployment = await midl.getDeployment("StructFunctionParam");

		if (!deployment) {
			throw new Error("StructFunctionParam not found");
		}

		const receipt = await getTransactionReceipt(await midl.getWalletClient(), {
			hash: deployment.txId,
		});

		expect(getAddress(receipt.from)).toEqual(evmAddress);
	});
});
