import { getLogger as midlGetLogger } from "@midl/logger";

const logger = midlGetLogger(["@midl/executor"]);

export enum LoggerNamespace {
	Actions = "actions",
	Utils = "utils",
}

export const getLogger = (categories: [LoggerNamespace, ...string[]]) => {
	return logger.getChild(categories);
};
