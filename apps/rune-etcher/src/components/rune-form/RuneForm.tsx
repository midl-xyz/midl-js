"use client";

import { Button } from "@/components/ui/button";
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
import { waitForTransaction } from "@midl-xyz/midl-js-core";
import {
  useAccounts,
  useBroadcastTransaction,
  useEtchRune,
  useMidlContext,
  useRunes,
} from "@midl-xyz/midl-js-react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { formatUnits } from "viem";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(14),
  symbol: z.string().max(1),
  divisibility: z.number().or(z.string()).pipe(z.coerce.number().max(38)),
  premine: z.number().or(z.string()).pipe(z.coerce.number()),
  mintable: z.boolean(),
  heightStart: z.number().or(z.string()).pipe(z.coerce.number()).optional(),
  heightEnd: z.number().or(z.string()).pipe(z.coerce.number()).optional(),
  amount: z.number().or(z.string()).pipe(z.coerce.number()).optional(),
  cap: z.number().or(z.string()).pipe(z.coerce.number()).optional(),
});

export const RuneForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "RUNE•NAME",
      symbol: "$",
      divisibility: 10,
      premine: 1000000000,
      mintable: false,
    },
  });

  const { toast } = useToast();
  const { config } = useMidlContext();

  const [name, isMintable, premine, divisibility] = form.watch([
    "name",
    "mintable",
    "premine",
    "divisibility",
  ]);

  const { etchRune, data } = useEtchRune({
    mutation: {
      onSuccess: data => {
        sendTransactions(data);
      },
      onError: error => {
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

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    etchRune({
      name: data.name,
      symbol: data.symbol,
      premine,
      divisibility,
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

  const { broadcastTransactionAsync } = useBroadcastTransaction();
  const { ordinalsAccount } = useAccounts();

  // biome-ignore lint/style/noNonNullAssertion: There is always an account
  const { runes } = useRunes({ address: ordinalsAccount?.address! });
  console.log(runes);

  const waitFor = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const { mutate: sendTransactions } = useMutation({
    mutationFn: async (
      data:
        | {
            fundingTx: string;
            etchingTx: string;
            revealTx: string;
          }
        | undefined
    ) => {
      if (!data?.fundingTx || !data?.etchingTx) {
        throw new Error("Missing transaction data");
      }

      console.log("Broadcasting transactions...");

      const fundingTxId = await broadcastTransactionAsync({
        tx: data.fundingTx,
      });

      console.log("Waiting for funding transaction confirmation...");

      // await waitForTransaction(config, fundingTxId, 1);

      console.log("Funding transaction confirmed");

      const etchingTxId = await broadcastTransactionAsync({
        tx: data.etchingTx,
      });

      console.log("Waiting for etching transaction confirmation...");

      // await waitForTransaction(config, etchingTxId, 1);
      console.log("Etching transaction confirmed");

      const revealTxId = await broadcastTransactionAsync({ tx: data.revealTx });

      console.log("Waiting for reveal transaction confirmation...");
      // await waitForTransaction(config, revealTxId, 1);

      console.log("Reveal transaction confirmed");
    },
  });

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field: { ref, ...field } }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={undefined}
                    onInput={field.onChange}
                    ref={node => {
                      ref(node);
                      runeNameRef(node);
                    }}
                  />
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
                    <Input {...field} type="number" />
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
                      onCheckedChange={e => field.onChange(e)}
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
    </div>
  );
};
