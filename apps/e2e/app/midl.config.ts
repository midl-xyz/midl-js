import { createConfig, regtest, unisat } from "@midl-xyz/midl-js-core";
import { satsConnect } from "@midl-xyz/midl-js-core/connectors/sats-connect";

export default createConfig({
	networks: [regtest],
	connectors: [satsConnect(), unisat()],
	persist: true,
});
