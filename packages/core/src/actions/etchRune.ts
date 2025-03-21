import { Psbt, initEccLib, networks, payments, script } from "bitcoinjs-lib";
import coinselect from "bitcoinselect";
import {
	EtchInscription,
	Etching,
	Range,
	Rune,
	Runestone,
	Terms,
	getSpacersVal,
	none,
	some,
} from "runelib";
import { getFeeRate } from "~/actions/getFeeRate";
import { getUTXOs } from "~/actions/getUTXOs";
import { signPSBT } from "~/actions/signPSBT";
import { AddressPurpose } from "~/constants";
import type { Config } from "~/createConfig";
import { extractXCoordinate, formatRuneName, makePSBTInputs } from "~/utils";
import ecc from "@bitcoinerlab/secp256k1";

initEccLib(ecc);

export type EtchRuneParams = {
	/**
	 * The address to etch the rune from
	 */
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

/**
 * Etches (mints) a rune on Bitcoin. The rune will be etched and revealed in the consecutive transactions.
 * This function creates the etching, funding, and reveal transactions.
 * The transactions won't be broadcasted. Once the transactions are created, you can broadcast them using the `broadcastTransaction` function in
 * the following order: funding, etching, reveal.
 *
 * @example
 * ```ts
 * import { etchRune } from "@midl-xyz/midl-js-core";
 * import { broadcastTransaction } from "@midl-xyz/midl-js-core";
 *
 * const etching = await etchRune(config, {
 * 	name: "RUNE•NAME",
 * 	receiver: "bc1q...",
 * 	amount: 100,
 *  ...
 * });
 *
 * const fundingTxHash = await broadcastTransaction(config, etching.fundingTx);
 * const etchingTxHash = await broadcastTransaction(config, etching.etchingTx);
 * const revealTxHash = await broadcastTransaction(config, etching.revealTx);
 *
 * console.log(fundingTxHash, etchingTxHash, revealTxHash);
 * ```
 *
 * @param config The configuration object
 * @param params The etch rune parameters
 * @returns The etching, funding, and reveal hex transactions
 */
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
	}: EtchRuneParams,
) => {
	const inscription = new EtchInscription();
	const runeName = formatRuneName(name);
	const feeRate = customFeeRate || (await getFeeRate(config)).hourFee;
	const { connection, network: currentNetwork } = config.getState();

	if (!connection) {
		throw new Error("No connection");
	}

	if (!currentNetwork) {
		throw new Error("No network");
	}

	const network = networks[currentNetwork.network];
	const { accounts } = config.getState();

	const account = from
		? accounts?.find((account) => account.address === from)
		: accounts?.[0];
	const ordinalsAccount = accounts?.find(
		(account) => account.purpose === AddressPurpose.Ordinals,
	);

	if (!account) {
		throw new Error("No funding account");
	}

	if (!ordinalsAccount) {
		throw new Error("No ordinals account");
	}

	if (content) {
		// TODO: Support other content types
		inscription.setContent("text/plain", Buffer.from(content, "utf-8"));
	}

	inscription.setRune(runeName);

	const xCoordinate = extractXCoordinate(account.publicKey);

	const etchingScriptAsm = `${xCoordinate} OP_CHECKSIG`;

	const etchingScript = Buffer.concat([
		script.fromASM(etchingScriptAsm),
		inscription.encipher(),
	]);

	const scriptTree: payments.Payment["scriptTree"] = {
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
		some(getSpacersVal(name)),
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
							: new Range(none(), none()),
					),
				)
			: none(),
		true,
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
		feeRate,
	);

	if (!selectedFundingUTXOs.inputs || !selectedFundingUTXOs.outputs) {
		throw new Error("No funding inputs or outputs");
	}

	const inputs = await makePSBTInputs(
		config,
		account,
		selectedFundingUTXOs.inputs,
	);

	psbtFunding.addInputs(inputs);

	for (const output of selectedFundingUTXOs.outputs) {
		if (!output.address) {
			output.address = account.address;
		}

		psbtFunding.addOutput({
			...output,
			value: output.value ? BigInt(output.value) : 0n,
		} as Parameters<typeof psbt.addOutput>[0]);
	}

	const psbtFundingData = psbtFunding.toBase64();

	const fundingData = await signPSBT(config, {
		psbt: psbtFundingData,
		signInputs: {
			[account.address]: selectedFundingUTXOs.inputs.map((_, i) => i),
		},
		disableTweakSigner: false,
	});

	const signedFundingPSBT = Psbt.fromBase64(fundingData.psbt, { network });

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
		feeRate,
	);

	if (!selectedUTXOs.inputs || !selectedUTXOs.outputs) {
		throw new Error("No inputs or outputs");
	}

	psbt.addInput({
		hash: fundingTx.getId() as string,
		index: 0,
		witnessUtxo: {
			value: BigInt(RUNE_MAGIC_VALUE + feeRate * ETCHING_TX_SIZE),
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
		value: BigInt(RUNE_MAGIC_VALUE),
	});

	const psbtData = psbt.toBase64();

	const data = await signPSBT(config, {
		psbt: psbtData,
		disableTweakSigner: true,
		signInputs: {
			[account.address]: [0],
		},
	});

	const signedPSBT = Psbt.fromBase64(data.psbt, { network });

	signedPSBT.finalizeAllInputs();

	const revealPsbt = new Psbt({ network });

	revealPsbt.addInput({
		hash: fundingTx.getId() as string,
		index: 1,
		witnessUtxo: {
			value: BigInt(RUNE_MAGIC_VALUE + feeRate * ETCHING_TX_SIZE),
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
		value: 0n,
	});

	revealPsbt.addOutput({
		address: receiver ?? ordinalsAccount.address,
		value: BigInt(RUNE_MAGIC_VALUE),
	});

	const revealPsbtData = revealPsbt.toBase64();

	const revealData = await signPSBT(config, {
		psbt: revealPsbtData,
		signInputs: {
			[account.address]: [0],
		},
		disableTweakSigner: true,
	});

	const revealSignedPSBT = Psbt.fromBase64(revealData.psbt, {
		network,
	}).finalizeAllInputs();

	const etchingTx = signedPSBT.extractTransaction();

	return {
		etchingTx: etchingTx.toHex(),
		fundingTx: fundingTx.toHex(),
		revealTx: revealSignedPSBT.extractTransaction().toHex(),
	};
};
