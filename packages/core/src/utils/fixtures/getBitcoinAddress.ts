import ecc from "@bitcoinerlab/secp256k1";
import * as bitcoin from "bitcoinjs-lib";
import ECPairFactory from "ecpair";

export const getBitcoinAddress = () => {
	const ECPair = ECPairFactory(ecc);
	bitcoin.initEccLib(ecc);

	const mainnetNetwork = bitcoin.networks.bitcoin;
	const regtestNetwork = bitcoin.networks.regtest;
	const testnetNetwork = bitcoin.networks.testnet;

	const keyPairMainnet = ECPair.makeRandom({ network: mainnetNetwork });
	const keyPairTestnet = ECPair.makeRandom({ network: testnetNetwork });
	const keyPairRegtest = ECPair.makeRandom({ network: regtestNetwork });

	const { address: p2wpkhMainnet } = bitcoin.payments.p2wpkh({
		pubkey: keyPairMainnet.publicKey,
		network: mainnetNetwork,
	});

	const { address: p2wpkhTestnet } = bitcoin.payments.p2wpkh({
		pubkey: keyPairTestnet.publicKey,
		network: testnetNetwork,
	});

	const { address: p2wpkhRegtest } = bitcoin.payments.p2wpkh({
		pubkey: keyPairRegtest.publicKey,
		network: regtestNetwork,
	});

	const { address: p2shMainnet } = bitcoin.payments.p2sh({
		redeem: bitcoin.payments.p2wpkh({
			pubkey: keyPairMainnet.publicKey,
			network: mainnetNetwork,
		}),
		network: mainnetNetwork,
	});

	const { address: p2shTestnet } = bitcoin.payments.p2sh({
		redeem: bitcoin.payments.p2wpkh({
			pubkey: keyPairTestnet.publicKey,
			network: testnetNetwork,
		}),
		network: testnetNetwork,
	});

	const { address: p2shRegtest } = bitcoin.payments.p2sh({
		redeem: bitcoin.payments.p2wpkh({
			pubkey: keyPairRegtest.publicKey,
			network: regtestNetwork,
		}),
		network: regtestNetwork,
	});

	const { address: p2trMainnet } = bitcoin.payments.p2tr({
		pubkey: keyPairMainnet.publicKey.slice(1, 33),
		network: mainnetNetwork,
	});

	const { address: p2trTestnet } = bitcoin.payments.p2tr({
		pubkey: keyPairTestnet.publicKey.slice(1, 33),
		network: testnetNetwork,
	});

	const { address: p2trRegtest } = bitcoin.payments.p2tr({
		pubkey: keyPairRegtest.publicKey.slice(1, 33),
		network: regtestNetwork,
	});

	const { address: p2pkhMainnet } = bitcoin.payments.p2pkh({
		pubkey: keyPairMainnet.publicKey,
		network: mainnetNetwork,
	});

	const { address: p2pkhTestnet } = bitcoin.payments.p2pkh({
		pubkey: keyPairTestnet.publicKey,
		network: testnetNetwork,
	});

	const { address: p2pkhRegtest } = bitcoin.payments.p2pkh({
		pubkey: keyPairRegtest.publicKey,
		network: regtestNetwork,
	});

	return {
		p2wpkhMainnet,
		p2wpkhTestnet,
		p2wpkhRegtest,
		p2shMainnet,
		p2shTestnet,
		p2shRegtest,
		p2trMainnet,
		p2trTestnet,
		p2trRegtest,
		p2pkhMainnet,
		p2pkhTestnet,
		p2pkhRegtest,
	};
};
