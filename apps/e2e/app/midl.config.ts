import { createConfig, regtest, unisat, bitget } from "@midl-xyz/midl-js-core";
import { xverse } from "@midl-xyz/midl-js-core/connectors/xverse";

export default createConfig({
	networks: [regtest],
	connectors: [xverse(), bitget(), unisat()],
	persist: true,
});
