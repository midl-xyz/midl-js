import { getLogger as midlGetLogger } from "@midl-xyz/logger";

const logger = midlGetLogger(["@midl-xyz/midl-js-executor"]);

export enum LoggerNamespace {
	Actions = "actions",
	Utils = "utils",
}

export const getLogger = (categories: [LoggerNamespace, ...string[]]) => {
	return logger.getChild(categories);
};
