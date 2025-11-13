import ecc from "@bitcoinerlab/secp256k1";
import * as bitcoin from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import { AddressPurpose, AddressType } from "~/constants";
import { extractXCoordinate } from "~/utils/extractXCoordinate";

export const getBitcoinAddress = () => {
	const ECPair = ECPairFactory(ecc);
	bitcoin.initEccLib(ecc);

	const mainnetNetwork = bitcoin.networks.bitcoin;
	const regtestNetwork = bitcoin.networks.regtest;
	const testnetNetwork = bitcoin.networks.testnet;

	const keyPairMainnet = ECPair.makeRandom({ network: mainnetNetwork });
	const keyPairTestnet = ECPair.makeRandom({ network: testnetNetwork });
	const keyPairRegtest = ECPair.makeRandom({ network: regtestNetwork });

	const p2wpkhMainnet = bitcoin.payments.p2wpkh({
		pubkey: keyPairMainnet.publicKey,
		network: mainnetNetwork,
	});

	const accountp2wpkhMainnet = {
		address: p2wpkhMainnet.address,
		publicKey: keyPairMainnet.publicKey.toString("hex"),
		purpose: AddressPurpose.Payment,
		addressType: AddressType.P2WPKH,
	};

	const p2wpkhTestnet = bitcoin.payments.p2wpkh({
		pubkey: keyPairTestnet.publicKey,
		network: testnetNetwork,
	});

	const accountp2wpkhTestnet = {
		address: p2wpkhTestnet.address as string,
		publicKey: keyPairTestnet.publicKey,
		purpose: AddressPurpose.Payment,
		addressType: AddressType.P2WPKH,
	};

	const p2wpkhRegtest = bitcoin.payments.p2wpkh({
		pubkey: keyPairRegtest.publicKey,
		network: regtestNetwork,
	});

	const accountp2wpkhRegtest = {
		address: p2wpkhRegtest.address as string,
		publicKey: keyPairRegtest.publicKey,
		purpose: AddressPurpose.Payment,
		addressType: AddressType.P2WPKH,
	};

	const p2shMainnet = bitcoin.payments.p2sh({
		redeem: bitcoin.payments.p2wpkh({
			pubkey: keyPairMainnet.publicKey,
			network: mainnetNetwork,
		}),
		network: mainnetNetwork,
	});

	const accountp2shMainnet = {
		address: p2shMainnet.address as string,
		publicKey: keyPairMainnet.publicKey,
		purpose: AddressPurpose.Payment,
		addressType: AddressType.P2SH_P2WPKH,
	};

	const p2shTestnet = bitcoin.payments.p2sh({
		redeem: bitcoin.payments.p2wpkh({
			pubkey: keyPairTestnet.publicKey,
			network: testnetNetwork,
		}),
		network: testnetNetwork,
	});

	const accountp2shTestnet = {
		address: p2shTestnet.address as string,
		publicKey: keyPairTestnet.publicKey.toString("hex"),
		purpose: AddressPurpose.Payment,
		addressType: AddressType.P2SH_P2WPKH,
	};

	const p2shRegtest = bitcoin.payments.p2sh({
		redeem: bitcoin.payments.p2wpkh({
			pubkey: keyPairRegtest.publicKey,
			network: regtestNetwork,
		}),
		network: regtestNetwork,
	});

	const accountp2shRegtest = {
		address: p2shRegtest.address as string,
		publicKey: keyPairRegtest.publicKey.toString("hex"),
		purpose: AddressPurpose.Payment,
		addressType: AddressType.P2SH_P2WPKH,
	};

	const p2trMainnet = bitcoin.payments.p2tr({
		internalPubkey: Buffer.from(
			extractXCoordinate(keyPairMainnet.publicKey.slice(1, 33).toString("hex")),
			"hex",
		),
		network: mainnetNetwork,
	});

	const accountp2trMainnet = {
		address: p2trMainnet.address as string,
		publicKey: keyPairMainnet.publicKey.slice(1, 33).toString("hex"),
		purpose: AddressPurpose.Ordinals,
		addressType: AddressType.P2TR,
	};

	const p2trTestnet = bitcoin.payments.p2tr({
		internalPubkey: Buffer.from(
			extractXCoordinate(keyPairTestnet.publicKey.slice(1, 33).toString("hex")),
			"hex",
		),
		network: testnetNetwork,
	});

	const accountp2trTestnet = {
		address: p2trTestnet.address,
		publicKey: keyPairTestnet.publicKey.slice(1, 33).toString("hex"),
		purpose: AddressPurpose.Ordinals,
		addressType: AddressType.P2TR,
	};

	const p2trRegtest = bitcoin.payments.p2tr({
		internalPubkey: Buffer.from(
			extractXCoordinate(keyPairRegtest.publicKey.slice(1, 33).toString("hex")),
			"hex",
		),
		network: regtestNetwork,
	});

	const accountp2trRegtest = {
		address: p2trRegtest.address as string,
		publicKey: keyPairRegtest.publicKey.slice(1, 33).toString("hex"),
		purpose: AddressPurpose.Ordinals,
		addressType: AddressType.P2TR,
	};

	const incorrectAddressTypeAddressMainnet = bitcoin.payments.p2pkh({
		pubkey: keyPairMainnet.publicKey,
		network: mainnetNetwork,
	});

	const incorrectAddressTypeAddressTestnet = bitcoin.payments.p2pkh({
		pubkey: keyPairTestnet.publicKey,
		network: testnetNetwork,
	});

	const incorrectAddressTypeAddressRegtest = bitcoin.payments.p2pkh({
		pubkey: keyPairRegtest.publicKey,
		network: regtestNetwork,
	});

	const accountIncorrectAddressTypeAddress = {
		address: incorrectAddressTypeAddressMainnet.address as string,
		publicKey: keyPairMainnet.publicKey.toString("hex"),
		purpose: AddressPurpose.Payment,
		addressType: undefined as unknown as AddressType,
	};

	return {
		accountp2wpkhMainnet,
		accountp2wpkhTestnet,
		accountp2wpkhRegtest,
		accountp2shMainnet,
		accountp2shTestnet,
		accountp2shRegtest,
		accountp2trMainnet,
		accountp2trTestnet,
		accountp2trRegtest,
		accountIncorrectAddressTypeAddress,
		p2wpkhMainnet,
		p2wpkhTestnet,
		p2wpkhRegtest,
		p2shMainnet,
		p2shTestnet,
		p2shRegtest,
		p2trMainnet,
		p2trTestnet,
		p2trRegtest,
		incorrectAddressTypeAddressMainnet,
		incorrectAddressTypeAddressTestnet,
		incorrectAddressTypeAddressRegtest,
	};
};
