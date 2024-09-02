import { defineConfig } from '@wagmi/cli';
import ExecutorMIDL from '@midl-xyz/contracts/deployments/0.0.1/ExecutorMidl.json' with { type: 'json' };
import type { Abi } from 'viem';

export default defineConfig({
  out: 'src/contracts/abi.ts',
  contracts: [
    {
      name: ExecutorMIDL.contractName,
      abi: ExecutorMIDL.abi as Abi,
    },
  ],
});
