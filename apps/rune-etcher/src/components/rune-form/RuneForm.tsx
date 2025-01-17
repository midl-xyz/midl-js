"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMaskito } from "@maskito/react";
import { SignMessageProtocol } from "@midl-xyz/midl-js-core";
import {
	useAccounts,
	useBroadcastTransaction,
	useConfig,
	useEtchRune,
	useMidlContext,
	useRune,
	useSignMessage,
	useWaitForTransaction,
} from "@midl-xyz/midl-js-react";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { formatUnits, keccak256, serializeTransaction, zeroAddress } from "viem";
import * as z from "zod";

const formSchema = z.object({
	name: z.string().min(4),
	symbol: z
		.string()
		.optional()
		.refine(
			(data) =>
				Array.from(new Intl.Segmenter().segment(data ?? "")).length === 1,
			"Symbol must be a single character",
		),
	divisibility: z.number().or(z.string()).pipe(z.coerce.number().max(38)),
	premine: z.number().or(z.string()).pipe(z.coerce.number()),
	mintable: z.boolean(),
	heightStart: z.number().or(z.string()).pipe(z.coerce.number()).optional(),
	heightEnd: z.number().or(z.string()).pipe(z.coerce.number()).optional(),
	offsetStart: z.number().or(z.string()).pipe(z.coerce.number()).optional(),
	offsetEnd: z.number().or(z.string()).pipe(z.coerce.number()).optional(),
	amount: z.number().or(z.string()).pipe(z.coerce.number()).optional(),
	cap: z.number().or(z.string()).pipe(z.coerce.number()).optional(),
	logo: z.instanceof(File).optional(),
});

export const RuneForm = () => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "RUNE•TO•THE•MOON",
			symbol: "🚀",
			divisibility: 18,
			premine: 1000000000000,
			mintable: false,
		},
	});

	const { toast } = useToast();
	const config = useConfig();

	const [name, isMintable, premine, divisibility] = form.watch([
		"name",
		"mintable",
		"premine",
		"divisibility",
	]);

	const { rune, isFetching } = useRune({ runeId: name });

	const {ordinalsAccount} = useAccounts();

	const { etchRune } = useEtchRune({
		mutation: {
			onSuccess: (data) => {
				sendTransactions(data);
			},
			onError: (error) => {
				console.error(error);
				toast({
					title: "Error",
					description:
						"error" in error
							? (
									error.error as {
										message: string;
									}
								).message
							: error.message,
					color: "error",
				});
			},
		},
	});

	const waitFor = (condition: () => boolean) => {
		return new Promise<void>((resolve) => {
			const interval = setInterval(() => {
				if (condition()) {
					clearInterval(interval);
					resolve();
				}
			}, 100);
		});
	};

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		await waitFor(() => {
			return !isFetching;
		});

		if (rune) {
			toast({
				title: "Error",
				description: "Rune already exists",
				color: "error",
			});

			return;
		}

		etchRune({
			name: data.name,
			symbol: data.symbol,
			premine,
			divisibility,
			heightStart: data.heightStart,
			heightEnd: data.heightEnd,
			offsetStart: data.offsetStart,
			offsetEnd: data.offsetEnd,
			amount: data.amount,
			cap: data.cap,
			content: "",
		});
	};

	const runeNameRef = useMaskito({
		options: {
			mask: /^[a-zA-Z\s•]+$/,
			postprocessors: [
				({ value, selection }) => {
					return {
						value: value
							.toLocaleUpperCase()
							.replace(/\s+/g, "•")
							.replace(/[•]+/g, "•"),
						selection,
					};
				},
			],
		},
	});

	const inputRef = useRef<HTMLInputElement | null>(null);

	const { broadcastTransactionAsync: broadcastFunding } =
		useBroadcastTransaction();
	const { broadcastTransactionAsync: broadcastEtching } =
		useBroadcastTransaction();
	const { broadcastTransactionAsync: broadcastReveal } =
		useBroadcastTransaction();

	const {
		waitForTransactionAsync: waitForTransaction,
		variables: waitForTransactionVariables,
	} = useWaitForTransaction();

	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const { mutate: sendTransactions } = useMutation({
		onSuccess: () => {
			setIsDialogOpen(false);
			toast({
				title: "Success",
				description: "Rune etched successfully",
				color: "success",
			});
		},
		mutationFn: async (
			data:
				| {
						fundingTx: string;
						etchingTx: string;
						revealTx: string;
				  }
				| undefined,
		) => {
			if (!data?.fundingTx || !data?.etchingTx) {
				throw new Error("Missing transaction data");
			}

			setIsDialogOpen(true);

			const fundingTxId = await broadcastFunding({
				tx: data.fundingTx,
			});

			await waitForTransaction({ txId: fundingTxId });

			const etchingTxId = await broadcastEtching({
				tx: data.etchingTx,
			});

			await waitForTransaction({
				txId: etchingTxId,
				confirmations: config.network?.network === "bitcoin" ? 5 : 1,
			});

			const revealTxId = await broadcastReveal({ tx: data.revealTx });

			await waitForTransaction({
				txId: revealTxId,
			});
		},
	});

	const {signMessageAsync} = useSignMessage();

	const onSignMessage =async ()=> {
		const simpleTx = serializeTransaction({
			to: zeroAddress,
			value: BigInt(100),
			gasPrice: BigInt(1000)
		})

		console.log('message', keccak256(simpleTx))

		const signature = await signMessageAsync({message: keccak256(simpleTx), address: ordinalsAccount?.address, protocol: SignMessageProtocol.Bip322 });
		console.log(signature);
	}

	return (
		<div>
			<Dialog open={isDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirming transactions</DialogTitle>
						<DialogDescription>
							<div className="mt-4 flex flex-col space-y-2">
								<Alert variant="default">
									<AlertTitle>Warning</AlertTitle>
									<AlertDescription>
										Don't close the window until the transactions are confirmed
									</AlertDescription>
								</Alert>

								<div className="flex flex-col items-center justify-center p-8 space-y-4">
									<p className="flex flex-col items-center space-y-2">
										<Loader2Icon className="h-8 w-8 animate-spin" />
										Waiting for{" "}
										{waitForTransactionVariables?.confirmations ?? 1}{" "}
										confirmation(s)
									</p>

									<a
										href={`${config.network?.explorerUrl}/tx/${waitForTransactionVariables?.txId}`}
										target="_blank"
										rel="noreferrer"
									>
										View transaction
									</a>
								</div>
							</div>
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field: { ref, ...field } }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											{...field}
											className="pr-10"
											onChange={undefined}
											onInput={field.onChange}
											ref={(node) => {
												inputRef.current = node;
												ref(node);
												runeNameRef(node);
											}}
										/>
										<Button
											type="button"
											aria-label="Add bullet"
											onClick={(e) => {
												const inputElement = inputRef.current;

												if (!inputElement) {
													return;
												}

												let { selectionStart, selectionEnd } = inputElement;

												if (document.activeElement !== inputElement) {
													selectionStart = inputElement.value.length;
													selectionEnd = inputElement.value.length;

													inputElement.focus();
												}

												inputElement.setSelectionRange(
													selectionStart,
													selectionEnd,
													"forward",
												);

												inputElement.setRangeText("•");

												inputElement.setSelectionRange(
													(selectionStart ?? 0) + 1,
													(selectionEnd ?? 0) + 1,
													"forward",
												);

												const event = new Event("input", {
													bubbles: true,
													cancelable: true,
												});

												inputElement.dispatchEvent(event);
											}}
											size="icon"
											className="absolute w-7 h-7 transform  -translate-y-1/2 top-1/2 right-1"
										>
											•
										</Button>
									</div>
								</FormControl>
								<FormDescription>Enter the name of the rune</FormDescription>
								{form.formState.errors.name && (
									<FormMessage>
										{form.formState.errors.name.message}
									</FormMessage>
								)}
							</FormItem>
						)}
					/>

					{/* <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo (optional)</FormLabel>
                <FormControl>
                  <Input {...field} type="file" />
                </FormControl>
                <FormDescription>Upload a logo for the rune</FormDescription>
                {form.formState.errors.logo && (
                  <FormMessage>
                    {form.formState.errors.logo.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          /> */}

					<div className="flex space-x-4">
						<FormField
							control={form.control}
							name="symbol"
							render={({ field }) => (
								<FormItem className="flex-grow">
									<FormLabel>Symbol (optional)</FormLabel>
									<FormControl>
										<Input {...field} max={1} />
									</FormControl>
									<FormDescription>
										Enter the symbol of the rune
									</FormDescription>
									{form.formState.errors.symbol && (
										<FormMessage>
											{form.formState.errors.symbol.message}
										</FormMessage>
									)}
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="divisibility"
							render={({ field }) => (
								<FormItem className="flex-grow">
									<FormLabel>Divisibility</FormLabel>
									<FormControl>
										<Input {...field} type="number" disabled />
									</FormControl>
									<FormDescription>
										Enter the divisibility of the rune
									</FormDescription>
									{form.formState.errors.divisibility && (
										<FormMessage>
											{form.formState.errors.divisibility.message}
										</FormMessage>
									)}
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="premine"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Premine</FormLabel>
								<FormControl>
									<Input {...field} type="number" autoComplete="off" />
								</FormControl>
								<FormDescription>
									{premine ? (
										<>
											Premine amount:{" "}
											{formatUnits(BigInt(premine), divisibility ?? 0)} {name}
										</>
									) : (
										<> Enter the premine of the rune</>
									)}
								</FormDescription>
								{form.formState.errors.premine && (
									<FormMessage>
										{form.formState.errors.premine.message}
									</FormMessage>
								)}
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="mintable"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center space-x-2">
									<FormControl>
										<Switch
											defaultChecked={field.value}
											name={field.name}
											onCheckedChange={(e) => field.onChange(e)}
										/>
									</FormControl>

									<FormLabel>Mintable</FormLabel>
								</div>
							</FormItem>
						)}
					/>

					{isMintable && (
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="heightStart"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Height Start</FormLabel>
										<FormControl>
											<Input {...field} type="number" />
										</FormControl>
										<FormDescription>
											Enter the height start of the rune
										</FormDescription>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="heightEnd"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Height End</FormLabel>
										<FormControl>
											<Input {...field} type="number" />
										</FormControl>
										<FormDescription>
											Enter the height end of the rune
										</FormDescription>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="offsetStart"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Offset Start</FormLabel>
										<FormControl>
											<Input {...field} type="number" />
										</FormControl>
										<FormDescription>
											Enter the offset start of the rune
										</FormDescription>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="offsetEnd"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Offset End</FormLabel>
										<FormControl>
											<Input {...field} type="number" />
										</FormControl>
										<FormDescription>
											Enter the offset end of the rune
										</FormDescription>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="amount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Amount</FormLabel>
										<FormControl>
											<Input {...field} type="number" />
										</FormControl>
										<FormDescription>
											Amount of the rune per mint
										</FormDescription>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="cap"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Max mints</FormLabel>
										<FormControl>
											<Input {...field} type="number" />
										</FormControl>
										<FormDescription>Allowed mints of the rune</FormDescription>
									</FormItem>
								)}
							/>
						</div>
					)}

					<Button type="submit" className="w-full">
						Etch Rune
					</Button>
				</form>
			</Form>

			<Button onClick={onSignMessage}>
				Sign Message
			</Button>
		</div>
	);
};
