"use client";

import { useAccounts, useEdictRune, useRune, useRunes } from "@midl/react";
import { SendIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { parseUnits } from "viem";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type FormValues = {
	address: string;
	amount: string;
	btcAmount: string;
};

export const RunesList = () => {
	const { ordinalsAccount } = useAccounts();
	const [rune, setRune] = useState<string | undefined>();
	const { rune: runeData } = useRune({
		// biome-ignore lint/style/noNonNullAssertion: this is intentional
		runeId: rune!,
		query: {
			enabled: Boolean(rune),
		},
	});

	const { reset, edictRune } = useEdictRune({
		mutation: {
			onSettled() {
				reset();
			},
			onSuccess() {
				toast({
					title: "Rune sent",
				});
			},
			onError(error) {
				toast({
					title: "Error",
					description: error.message,
					color: "error",
				});
			},
		},
	});

	const { runes } = useRunes({
		address: ordinalsAccount?.address ?? "",
		query: {
			enabled: Boolean(ordinalsAccount),
		},
		limit: 60,
	});

	const { toast } = useToast();

	const onSubmit = ({ address, amount, btcAmount }: FormValues) => {
		if (!runeData) {
			return;
		}

		// biome-ignore lint/suspicious/noExplicitAny: this is intentional
		const transfers: any = [
			{
				receiver: address,
				runeId: runeData.id,
				amount: parseUnits(amount, runeData.divisibility),
			},
		];

		const parseBTCAmount = Number.parseInt(
			parseUnits(btcAmount, 8).toString(),
			10,
		);

		if (parseBTCAmount > 0) {
			transfers.push({
				receiver: address,
				amount: parseBTCAmount,
			});
		}

		console.log(transfers);

		edictRune({
			transfers: transfers,
			publish: true,
		});
	};

	const { handleSubmit, register } = useForm<FormValues>();

	return (
		<Dialog>
			<div className="p-4 bg-gray-100 rounded-lg">
				<div className="grid grid-cols-1 gap-4">
					{runes?.results?.map((rune) => (
						<div
							key={rune.rune.id}
							className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-row justify-between"
						>
							<div>
								<div className="flex flex-row gap-1 items-center">
									<span className="text-lg text-gray-600">
										{rune.rune.name}
									</span>
									<span className="text-xs text-gray-400">{rune.rune.id}</span>
								</div>
								<div className="text-sm text-gray-500">
									Balance: {rune.balance}
								</div>
							</div>
							<DialogTrigger asChild>
								<Button
									onClick={() => setRune(rune.rune.id)}
									className="mt-2 flex items-center"
								>
									<SendIcon className="w-4 h-4 mr-2" />
									Send
								</Button>
							</DialogTrigger>
						</div>
					))}
				</div>
			</div>

			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Send rune</DialogTitle>
					<DialogDescription>
						Send a rune to another wallet address
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="address" className="text-right">
								Address
							</Label>
							<Input
								id="address"
								{...register("address")}
								className="col-span-3"
								placeholder="bc1q..."
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="amount" className="text-right">
								Amount
							</Label>
							<Input
								id="amount"
								className="col-span-3"
								placeholder="902.123"
								{...register("amount")}
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="btcAmount" className="text-right">
								BTC Amount
							</Label>
							<Input
								id="btcAmount"
								className="col-span-3"
								placeholder="902.123"
								defaultValue="0"
								{...register("btcAmount")}
							/>
						</div>
					</div>
					<DialogFooter>
						<DialogClose>
							<Button type="submit">Send</Button>
						</DialogClose>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
