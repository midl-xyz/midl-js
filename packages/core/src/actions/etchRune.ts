import {
  Etching,
  EtchInscription,
  none,
  Range,
  Rune,
  Runestone,
  some,
  Terms,
} from "runelib";
import type { Config } from "~/createConfig";
import { extractXCoordinate, formatRuneName } from "~/utils";
import { networks, payments, Psbt, script } from "bitcoinjs-lib";
import type { Taptree } from "bitcoinjs-lib/src/types";
import { AddressPurpose } from "~/constants";
import { getUTXOs } from "~/actions/getUTXOs";
import { signPSBT } from "~/actions/signPSBT";

export type EtchRuneParams = {
  name: string;
  content?: string;
  address?: string;
  amount: number;
  cap: number;
  symbol: string;
  feeRate?: number;
};

const ETCHING_SCRIPT_VERSION = 192;
const RUNE_MAGIC_VALUE = 546;

export const etchRune = async (
  config: Config,
  { content, name, address, amount, cap, symbol }: EtchRuneParams
) => {
  const inscription = new EtchInscription();
  const runeName = formatRuneName(name);

  if (!config.currentConnection) {
    throw new Error("No connection");
  }

  if (!config.network) {
    throw new Error("No network");
  }

  const network = networks[config.network.network];
  const accounts = await config.currentConnection.getAccounts();
  const account = accounts.find(account => account.address === address);
  const ordinalsAccount = accounts.find(
    account => account.purpose === AddressPurpose.Ordinals
  );

  if (!account) {
    throw new Error("No account");
  }

  if (!ordinalsAccount) {
    throw new Error("No ordinals account");
  }

  if (content) {
    inscription.setContent("text/plain", Buffer.from(content, "utf-8"));
  }

  inscription.setRune(runeName);

  const xCoordinate = extractXCoordinate(account.publicKey);

  const etchingScriptAsm = `${xCoordinate} OP_CHECKSIG`;

  const etchingScript = Buffer.concat([
    script.fromASM(etchingScriptAsm),
    inscription.encipher(),
  ]);

  const scriptTree: Taptree = {
    output: etchingScript,
  };

  const scriptP2TR = payments.p2tr({
    internalPubkey: Buffer.from(xCoordinate, "hex"),
    scriptTree,
    network,
  });

  const etchingRedeem = {
    output: etchingScript,
    redeemVersion: ETCHING_SCRIPT_VERSION,
  };

  const etchingP2TR = payments.p2tr({
    internalPubkey: Buffer.from(xCoordinate, "hex"),
    scriptTree,
    redeem: etchingRedeem,
    network,
  });

  const rune = Rune.fromName(runeName);

  const terms = new Terms(
    amount,
    cap,
    new Range(none(), none()),
    new Range(none(), none())
  );

  const premine = none();
  const divisibility = none();

  const etching = new Etching(
    divisibility,
    premine,
    some(rune),
    none(),
    some(symbol),
    some(terms),
    true
  );

  const stone = new Runestone([], some(etching), none(), none());

  const psbt = new Psbt({ network });

  const utxos = await getUTXOs(config, account.address);

  psbt.addInput({
    hash: utxos[0].txid,
    index: utxos[0].vout,
    witnessUtxo: {
      value: utxos[0].value,
      // biome-ignore lint/style/noNonNullAssertion: output is defined
      script: scriptP2TR.output!,
    },
    tapLeafScript: [
      {
        leafVersion: ETCHING_SCRIPT_VERSION,
        script: etchingRedeem.output,
        // biome-ignore lint/style/noNonNullAssertion: witness is defined
        controlBlock: etchingP2TR.witness![etchingP2TR.witness!.length - 1],
      },
    ],
  });

  psbt.addOutput({
    script: stone.encipher(),
    value: 0,
  });

  psbt.addOutput({
    address: ordinalsAccount.address,
    value: RUNE_MAGIC_VALUE,
  });

  psbt.addOutput({
    address: account.address,
    value: 0,
  });

  const psbtData = psbt.toBase64();

  const data = await signPSBT(config, {
    psbt: psbtData,
    key: account.address,
  });

  return data;
};
