import { Psbt, initEccLib, networks, payments } from "bitcoinjs-lib";
import coinSelect from "bitcoinselect";
import { AddressPurpose } from "sats-connect";
import { broadcastTransaction } from "~/actions/broadcastTransaction";
import { getFeeRate } from "~/actions/getFeeRate";
import { getUTXOs } from "~/actions/getUTXOs";
import type { Config } from "~/createConfig";

export type TransferBTCParams = {
  transfers: {
    receiver: string;
    amount: number;
  }[];
  feeRate?: number;
  publish?: boolean;
};

export type TransferBTCResponse = {
  psbt: string;
  txId?: string;
};

export const transferBTC = async (
  config: Config,
  { transfers, feeRate: customFeeRate, publish }: TransferBTCParams
): Promise<TransferBTCResponse> => {
  if (!config.currentConnection) {
    throw new Error("No connection");
  }

  if (!config.network) {
    throw new Error("No network");
  }

  await import("tiny-secp256k1").then(initEccLib);

  const paymentAccount = config
    .getState()
    .accounts?.find(account => account.purpose === AddressPurpose.Payment);

  if (!paymentAccount) {
    throw new Error("No payment account");
  }

  const network = networks[config.network.network];
  const feeRate = customFeeRate || (await getFeeRate(config)).hourFee;

  const utxos = await getUTXOs(config, paymentAccount.address);
  const outputs = [];

  for (const transfer of transfers) {
    outputs.push({
      address: transfer.receiver,
      value: transfer.amount,
    });
  }

  const selectedUTXOs = coinSelect(utxos, outputs, feeRate);

  if (!selectedUTXOs.inputs || !selectedUTXOs.outputs) {
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

  for (const output of selectedUTXOs.outputs) {
    if (!output.address) {
      output.address = paymentAccount.address;
    }

    psbt.addOutput(output as Parameters<typeof psbt.addOutput>[0]);
  }

  const psbtData = psbt.toBase64();

  const data = await config.currentConnection.signPSBT({
    psbt: psbtData,
    signInputs: {
      [paymentAccount.address]: selectedUTXOs.inputs.map(
        (_input, index) => index
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
