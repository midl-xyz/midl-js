import { Psbt, initEccLib, networks, payments, script } from "bitcoinjs-lib";
import type { Taptree } from "bitcoinjs-lib/src/types";
import coinselect from "bitcoinselect";
import {
  EtchInscription,
  Etching,
  Range,
  Rune,
  Runestone,
  Terms,
  none,
  some,
} from "runelib";
import { getFeeRate } from "~/actions/getFeeRate";
import { getUTXOs } from "~/actions/getUTXOs";
import { signPSBT } from "~/actions/signPSBT";
import { AddressPurpose, AddressType } from "~/constants";
import type { Config } from "~/createConfig";
import { extractXCoordinate, formatRuneName } from "~/utils";

export type EtchRuneParams = {
  from?: string;

  /**
   * The name of the rune to etch. Should be uppercase and spaced with • (U+2022).
   * Example: "RUNE•NAME"
   */
  name: string;
  /**
   * The symbol of the rune to etch. One character only.
   */
  symbol?: string;
  /**
   * The content to inscribe on the rune.
   */
  content?: string;
  /**
   * The address to mint the rune to.
   */
  receiver?: string;
  /**
   * The amount minted per each mint.
   */
  amount?: number;
  /**
   * The maximum number of mints allowed.
   */
  cap?: number;
  /**
   * The fee rate to use for the etching transaction.
   */
  feeRate?: number;
  /**
   * The amount of premined runes to include in the etching.
   */
  premine?: number;
  /**
   * The height at which the minting starts.
   */
  heightStart?: number;
  /**
   * The height at which the minting ends.
   */
  heightEnd?: number;
  /**
   * The divisibility of the rune.
   */
  divisibility?: number;
  /**
   * The offset after etching when minting starts.
   */
  offsetStart?: number;
  /**
   * The offset after etching when minting ends.
   */
  offsetEnd?: number;
};

const ETCHING_SCRIPT_VERSION = 192;
const RUNE_MAGIC_VALUE = 546;
const ETCHING_TX_SIZE = 350;

export const etchRune = async (
  config: Config,
  {
    from,
    content,
    name,
    receiver,
    amount,
    cap,
    symbol,
    feeRate: customFeeRate,
    premine,
    heightEnd,
    heightStart,
    divisibility,
    offsetEnd,
    offsetStart,
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
  const { accounts } = config.getState();

  const account = from
    ? accounts?.find(account => account.address === from)
    : accounts?.[0];
  const ordinalsAccount = accounts?.find(
    account => account.purpose === AddressPurpose.Ordinals
  );

  if (!account) {
    throw new Error("No funding account");
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

  const etching = new Etching(
    divisibility ? some(divisibility) : none(),
    premine ? some(premine) : none(),
    some(rune),
    none(),
    symbol ? some(symbol) : none(),
    amount && cap
      ? some(
          new Terms(
            amount,
            cap,
            heightStart && heightEnd
              ? new Range(some(heightStart), some(heightEnd))
              : new Range(none(), none()),
            offsetStart && offsetEnd
              ? new Range(some(offsetStart), some(offsetEnd))
              : new Range(none(), none())
          )
        )
      : none(),
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

  console.log(account.addressType);

  switch (account.addressType) {
    case AddressType.P2SH: {
      const { redeem } = payments.p2sh({
        redeem: payments.p2wpkh({
          pubkey: Buffer.from(account.publicKey, "hex"),
        }),
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

      break;
    }

    case AddressType.P2TR: {
      const xOnly = Buffer.from(extractXCoordinate(account.publicKey), "hex");

      const p2tr = payments.p2tr({
        internalPubkey: xOnly,
        network,
      });

      for (const input of selectedFundingUTXOs.inputs) {
        psbtFunding.addInput({
          hash: input.txid as string,
          index: input.vout,
          witnessUtxo: {
            value: input.value,
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            script: p2tr!.output!,
          },
          tapInternalKey: xOnly,
        });
      }

      break;
    }

    case AddressType.P2WPKH: {
      const p2wpkh = payments.p2wpkh({
        pubkey: Buffer.from(account.publicKey, "hex"),
        network,
      });

      for (const input of selectedFundingUTXOs.inputs) {
        psbtFunding.addInput({
          hash: input.txid as string,
          index: input.vout,
          witnessUtxo: {
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            script: p2wpkh.output!,
            value: input.value,
          },
        });
      }
    }
  }

  for (const output of selectedFundingUTXOs.outputs) {
    if (!output.address) {
      output.address = account.address;
    }

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

  psbt.addInput({
    hash: fundingTx.getId() as string,
    index: 0,
    witnessUtxo: {
      value: RUNE_MAGIC_VALUE + feeRate * ETCHING_TX_SIZE,
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

  psbt.addOutput({
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    address: scriptP2TR.address!,
    value: RUNE_MAGIC_VALUE,
  });

  const psbtData = psbt.toBase64();

  const data = await signPSBT(config, {
    psbt: psbtData,
    disableTweakSigner: true,
    signInputs: {
      [account.address]: [0],
    },
  });

  const signedPSBT = Psbt.fromBase64(data.psbt);

  signedPSBT.finalizeAllInputs();

  const revealPsbt = new Psbt({ network });

  revealPsbt.addInput({
    hash: fundingTx.getId() as string,
    index: 1,
    witnessUtxo: {
      value: RUNE_MAGIC_VALUE + feeRate * ETCHING_TX_SIZE,
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

  revealPsbt.addOutput({
    script: stone.encipher(),
    value: 0,
  });

  revealPsbt.addOutput({
    address: receiver ?? ordinalsAccount.address,
    value: RUNE_MAGIC_VALUE,
  });

  const revealPsbtData = revealPsbt.toBase64();

  const revealData = await signPSBT(config, {
    psbt: revealPsbtData,
    signInputs: {
      [account.address]: [0],
    },
    disableTweakSigner: true,
  });

  const revealSignedPSBT = Psbt.fromBase64(revealData.psbt).finalizeAllInputs();

  const etchingTx = signedPSBT.extractTransaction();

  return {
    etchingTx: etchingTx.toHex(),
    fundingTx: fundingTx.toHex(),
    revealTx: revealSignedPSBT.extractTransaction().toHex(),
  };
};
