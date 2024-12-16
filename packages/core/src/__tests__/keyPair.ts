import ecc from "@bitcoinerlab/secp256k1";
import ECPairFactory from "ecpair";

const ECPair = ECPairFactory(ecc);

export const keyPair = ECPair.fromPrivateKey(
	Buffer.from(
		"d6253db0047fcd99323946c6c535d227279881c5329d1de5006247a3689a6b11",
		"hex",
	),
);
