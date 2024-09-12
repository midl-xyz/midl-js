import { Psbt, initEccLib, networks, payments } from "bitcoinjs-lib";
import coinSelect from "bitcoinselect";
import { Edict, RuneId, Runestone, none, some } from "runelib";
import { AddressPurpose } from "sats-connect";
import { broadcastTransaction } from "~/actions/broadcastTransaction";
import { getFeeRate } from "~/actions/getFeeRate";
import { getRuneUTXO } from "~/actions/getRuneUTXO";
import { getUTXOs } from "~/actions/getUTXOs";
import type { Config } from "~/createConfig";
import { runeUTXOSelect } from "~/utils";

export type EdictRuneParams = {
  transfers: (
    | {
        runeId: string;
        amount: bigint;
        receiver: string;
      }
    | {
        receiver: string;
        amount: number;
      }
  )[];
  feeRate?: number;
  publish?: boolean;
};

export type EdictRuneResponse = {
  psbt: string;
  txId?: string;
};

const RUNE_MAGIC_VALUE = 546;

export const edictRune = async (
  config: Config,
  { transfers, feeRate: customFeeRate, publish }: EdictRuneParams
): Promise<EdictRuneResponse> => {
  if (!config.currentConnection) {
    throw new Error("No connection");
  }

  if (!config.network) {
    throw new Error("No network");
  }

  await import("tiny-secp256k1").then(initEccLib);

  const ordinalsAccount = config
    .getState()
    .accounts?.find(account => account.purpose === AddressPurpose.Ordinals);

  const paymentAccount = config
    .getState()
    .accounts?.find(account => account.purpose === AddressPurpose.Payment);

  if (!ordinalsAccount) {
    throw new Error("No ordinals account");
  }

  if (!paymentAccount) {
    throw new Error("No payment account");
  }

  const network = networks[config.network.network];
  const feeRate = customFeeRate || (await getFeeRate(config)).hourFee;

  const utxos = await getUTXOs(config, paymentAccount.address);
  const runeUTXOs = [];
  const outputs = [];

  for (const transfer of transfers) {
    if ("runeId" in transfer) {
      const utxos = await getRuneUTXO(
        config,
        ordinalsAccount.address,
        transfer.runeId
      );

      if (utxos.length === 0) {
        throw new Error("No ordinals UTXOs");
      }

      runeUTXOs.push(...runeUTXOSelect(utxos, transfer.amount));
    } else {
      outputs.push({
        address: transfer.receiver,
        value: transfer.amount,
      });
    }
  }

  for (const receiver of Array.from(
    new Set(
      transfers.filter(t => "runeId" in t).map(transfer => transfer.receiver)
    )
  )) {
    outputs.push({
      address: receiver,
      value: RUNE_MAGIC_VALUE,
    });
  }

  outputs.push({
    address: ordinalsAccount.address,
    value: RUNE_MAGIC_VALUE,
  });

  const selectedUTXOs = coinSelect(utxos, outputs, feeRate);

  if (
    !selectedUTXOs.inputs ||
    runeUTXOs.length === 0 ||
    !selectedUTXOs.outputs
  ) {
    throw new Error("No selected UTXOs");
  }

  const psbt = new Psbt({ network });

  const { redeem } = payments.p2sh({
    redeem: payments.p2wpkh({
      pubkey: Buffer.from(paymentAccount.publicKey, "hex"),
    }),
  });

  for (const input of selectedUTXOs.inputs) {
    const hex = await fetch(
      `${config.network.rpcUrl}/tx/${input.txid}/hex`
    ).then(response => response.text());

    psbt.addInput({
      hash: input.txid as string,
      index: input.vout,
      nonWitnessUtxo: Buffer.from(hex, "hex"),
      redeemScript: redeem?.output,
    });
  }

  const ordinalsP2TR = payments.p2tr({
    internalPubkey: Buffer.from(ordinalsAccount.publicKey, "hex"),
    network,
  });

  for (const utxo of runeUTXOs) {
    psbt.addInput({
      hash: utxo.txid,
      index: utxo.vout,
      witnessUtxo: {
        value: utxo.satoshis,
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        script: ordinalsP2TR.output!,
      },
      tapInternalKey: Buffer.from(ordinalsAccount.publicKey, "hex"),
    });
  }

  for (const output of selectedUTXOs.outputs) {
    if (!output.address) {
      output.address = paymentAccount.address;
    }

    psbt.addOutput(output as Parameters<typeof psbt.addOutput>[0]);
  }

  const transferGroupedByRunes = transfers.reduce(
    (acc, transfer) => {
      if ("runeId" in transfer) {
        if (!acc[transfer.runeId]) {
          acc[transfer.runeId] = [];
        }

        acc[transfer.runeId].push(transfer);
      }

      return acc;
    },
    {} as Record<
      string,
      {
        amount: bigint;
        receiver: string;
        runeId: string;
      }[]
    >
  );

  for (const [runeId, runeTransfers] of Object.entries(
    transferGroupedByRunes
  )) {
    const [blockHeight, txIndex] = runeId.split(":").map(Number);

    const edicts = runeTransfers.map(transfer => {
      return new Edict(
        new RuneId(blockHeight, txIndex),
        transfer.amount,
        transfers.findIndex(t => t === transfer)
      );
    });

    const mintStone = new Runestone(edicts, none(), none(), some(2));

    psbt.addOutput({
      script: mintStone.encipher(),
      value: 0,
    });
  }

  const psbtData = psbt.toBase64();

  const data = await config.currentConnection.signPSBT({
    psbt: psbtData,
    signInputs: {
      [paymentAccount.address]: selectedUTXOs.inputs.map(
        (_input, index) => index
      ),
      [ordinalsAccount.address]: runeUTXOs.map(
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        (_input, index) => (selectedUTXOs.inputs!.length ?? 0) + index
      ),
    },
  });

  const signedPSBT = Psbt.fromBase64(data.psbt);

  signedPSBT.finalizeAllInputs();

  const psbtBase64 = signedPSBT.toBase64();

  if (publish) {
    const hex = signedPSBT.extractTransaction().toHex();

    const txId = await broadcastTransaction(config, hex);

    return {
      psbt: psbtBase64,
      txId,
    };
  }

  return { psbt: psbtBase64 };
};
