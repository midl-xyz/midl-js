"use client";

import { RuneForm } from "@/components/rune-form/RuneForm";
import { useAccounts, useRunes } from "@midl-xyz/midl-js-react";

export default function Home() {
  const { ordinalsAccount } = useAccounts();

  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const { runes } = useRunes({ address: ordinalsAccount?.address! });

  return (
    <div className="flex flex-col items-center pt-[12vh]">
      <div className="flex space-y-8 flex-col justify-center w-full max-w-[450px]">
        <div className="flex flex-col space-y-0 items-start">
          <h1 className="text-3xl font-bold text-primary">
            Bitcoin Rune Etcher
          </h1>
          <p className="text-lg">Etch runes on the Bitcoin blockchain</p>
        </div>

        <div>
          <RuneForm />
        </div>

        <div className="flex flex-col space-y-4">
          <h2 className="text-xl font-bold">My Runes</h2>
          <div className="space-y-4">
            {runes?.results.map(rune => (
              <div key={rune.rune.id} className="flex justify-between">
                <div
                  key={rune.rune.id}
                  className="flex justify-center space-y-1 flex-col"
                >
                  <span className="text-md">{rune.rune.name}</span>
                  <span className="text-sm text-gray-500">
                    {rune.rune.spaced_name}
                  </span>
                </div>
                <span className="text-xs">{rune.balance}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
