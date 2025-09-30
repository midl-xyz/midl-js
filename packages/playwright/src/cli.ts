import fs from "node:fs";
import path from "node:path";

import { extensions } from "~/config";
const pathToRemove = path.join(extensions.path, "./.data");

fs.rmdirSync(pathToRemove, { recursive: true });
