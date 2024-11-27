import { createConfig, leather, regtest, unisat } from "@midl-xyz/midl-js-core";

export default createConfig({
	networks: [regtest],
	connectors: [leather(), unisat()],
	persist: true,
});
