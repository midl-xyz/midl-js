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
import { initEccLib, networks, payments, Psbt, script } from "bitcoinjs-lib";
import type { Taptree } from "bitcoinjs-lib/src/types";
import { AddressPurpose } from "~/constants";
import { getUTXOs } from "~/actions/getUTXOs";
import { signPSBT } from "~/actions/signPSBT";
import coinselect from "bitcoinselect";
import { getFeeRate } from "~/actions/getFeeRate";

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
const ETCHING_TX_SIZE = 250;

export const etchRune = async (
  config: Config,
  {
    content,
    name,
    address,
    amount,
    cap,
    symbol,
    feeRate: customFeeRate,
  }: EtchRuneParams
) => {
  const inscription = new EtchInscription();
  const runeName = formatRuneName(name);
  const feeRate = customFeeRate || (await getFeeRate(config)).hourFee;

  await import("tiny-secp256k1").then(initEccLib);

  if (!config.currentConnection) {
    throw new Error("No connection");
  }

  if (!config.network) {
    throw new Error("No network");
  }

  const network = networks[config.network.network];
  const accounts = await config.currentConnection.getAccounts();
  const account = address
    ? accounts.find(account => account.address === address)
    : accounts.find(account => account.purpose === AddressPurpose.Payment);
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

  const psbtFunding = new Psbt({ network });

  const fundingUTXOs = await getUTXOs(config, account.address);

  const selectedFundingUTXOs = coinselect(
    fundingUTXOs,
    [
      {
        address: scriptP2TR.address,
        value: RUNE_MAGIC_VALUE + feeRate * ETCHING_TX_SIZE,
      },
    ],
    feeRate
  );

  if (!selectedFundingUTXOs.inputs || !selectedFundingUTXOs.outputs) {
    throw new Error("No funding inputs or outputs");
  }

  const { redeem } = payments.p2sh({
    redeem: payments.p2wpkh({ pubkey: Buffer.from(account.publicKey, "hex") }),
  });

  for (const input of selectedFundingUTXOs.inputs) {
    const hex = await fetch(
      `${config.network.rpcUrl}/tx/${input.txid}/hex`
    ).then(response => response.text());

    psbtFunding.addInput({
      hash: input.txid as string,
      index: input.vout,
      nonWitnessUtxo: Buffer.from(hex, "hex"),
      redeemScript: redeem?.output,
    });
  }

  for (const output of selectedFundingUTXOs.outputs) {
    psbtFunding.addOutput(
      output as Parameters<typeof psbtFunding.addOutput>[0]
    );
  }

  const psbtFundingData = psbtFunding.toBase64();

  const fundingData = await signPSBT(config, {
    psbt: psbtFundingData,
    signInputs: {
      [account.address]: [0],
    },
  });

  const signedFundingPSBT = Psbt.fromBase64(fundingData.psbt);

  signedFundingPSBT.finalizeAllInputs();

  const fundingTx = signedFundingPSBT.extractTransaction();

  const psbt = new Psbt({ network });

  const selectedUTXOs = coinselect(
    [
      {
        txid: fundingTx.getId(),
        vout: 0,
        value: RUNE_MAGIC_VALUE + feeRate * ETCHING_TX_SIZE,
      },
    ],
    [
      {
        address: ordinalsAccount.address,
        value: RUNE_MAGIC_VALUE,
      },
      {
        script: stone.encipher(),
        value: 0,
      },
    ],
    feeRate
  );

  if (!selectedUTXOs.inputs || !selectedUTXOs.outputs) {
    throw new Error("No inputs or outputs");
  }

  for (const input of selectedUTXOs.inputs) {
    psbt.addInput({
      hash: input.txid as string,
      index: input.vout,
      witnessUtxo: {
        value: input.value,
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        script: scriptP2TR.output!,
      },
      tapLeafScript: [
        {
          leafVersion: etchingRedeem.redeemVersion,
          script: etchingRedeem.output,
          // biome-ignore lint/style/noNonNullAssertion: witness is defined
          controlBlock: etchingP2TR.witness![etchingP2TR.witness!.length - 1],
        },
      ],
    });
  }

  for (const output of selectedUTXOs.outputs) {
    if (!output.address) {
      output.address = account.address;
    }

    psbt.addOutput(output as Parameters<typeof psbt.addOutput>[0]);
  }

  const psbtData = psbt.toBase64();

  const data = await signPSBT(config, {
    psbt: psbtData,
    signInputs: {
      [account.address]: [0],
    },
  });

  const signedPSBT = Psbt.fromBase64(data.psbt);

  signedPSBT.finalizeAllInputs();

  return {
    etchingTx: signedPSBT.extractTransaction().toHex(),
    fundingTx: fundingTx.toHex(),
  };
};
