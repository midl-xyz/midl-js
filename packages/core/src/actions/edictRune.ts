import { Psbt, initEccLib, networks, payments } from "bitcoinjs-lib";
import coinSelect from "bitcoinselect";
import { Edict, RuneId, Runestone, none, some } from "runelib";
import { AddressPurpose } from "sats-connect";
import { getFeeRate } from "~/actions/getFeeRate";
import { getRuneUTXO } from "~/actions/getRuneUTXO";
import { getUTXOs } from "~/actions/getUTXOs";
import type { Config } from "~/createConfig";
import { runeUTXOSelect } from "~/utils";

export type EdictRuneParams = {
  runeId: string;
  amount: bigint;
  receiver: string;
  feeRate?: number;
};

const RUNE_MAGIC_VALUE = 546;

export const edictRune = async (
  config: Config,
  { runeId, amount, receiver, feeRate: customFeeRate }: EdictRuneParams
) => {
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
  const ordinalsUTXOs = await getRuneUTXO(
    config,
    ordinalsAccount.address,
    runeId
  );

  if (ordinalsUTXOs.length === 0) {
    throw new Error("No ordinals UTXOs");
  }

  const selectedUTXOs = coinSelect(
    utxos,
    [
      {
        address: receiver,
        value: RUNE_MAGIC_VALUE,
      },
      {
        address: ordinalsAccount.address,
        value: RUNE_MAGIC_VALUE,
      },
    ],
    feeRate
  );
  const runeUTXOs = runeUTXOSelect(ordinalsUTXOs, amount);

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

  console.log(ordinalsP2TR.address);

  for (const utxo of runeUTXOs) {
    psbt.addInput({
      hash: utxo.txid,
      index: utxo.vout,
      witnessUtxo: {
        value: utxo.satoshi,
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        script: ordinalsP2TR.output!,
      },
      tapInternalKey: Buffer.from(ordinalsAccount.publicKey, "hex"),
    });
  }

  const [blockHeight, txIndex] = runeId.split(":").map(Number);

  const edict: Edict = new Edict(new RuneId(blockHeight, txIndex), amount, 1);

  const mintStone = new Runestone([edict], none(), none(), some(2));

  psbt.addOutput({
    script: mintStone.encipher(),
    value: 0,
  });

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
      [ordinalsAccount.address]: runeUTXOs.map(
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        (_input, index) => (selectedUTXOs.inputs!.length ?? 0) + index
      ),
    },
  });

  const signedPSBT = Psbt.fromBase64(data.psbt);

  signedPSBT.finalizeAllInputs();

  const hex = signedPSBT.extractTransaction().toHex();

  return hex;
};
