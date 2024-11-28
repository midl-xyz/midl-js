import esbuild from "esbuild";
import { execSync } from "node:child_process";
import path from "node:path";
import { replaceTscAliasPaths } from "tsc-alias";
import fg from "fast-glob";

console.log("Cleaning...");

execSync("rm -rf dist/*", { stdio: "inherit" });

console.log("Building...");

execSync("tsc --project tsconfig.json", { stdio: "inherit" });

const entryPoints = fg.globSync(["./src/**/*.{ts,js,tsx,jsx}"], {
	ignore: ["./src/**/*.test.{ts,tsx,js,jsx}", "./src/**/__tests__/**/*"],
});

const executionDir = process.cwd();
const tsConfigPath = path.resolve(executionDir, "tsconfig.json");

await esbuild
	.build({
		entryPoints,
		outdir: "dist",
		outbase: "src",
		format: "esm",
		sourcemap: true,
		loader: { ".ts": "ts", ".js": "js" },
		target: "esnext",
		minify: true,
		tsconfig: tsConfigPath,
	})
	.catch(() => process.exit(1));

await replaceTscAliasPaths({
	configFile: tsConfigPath,
	watch: false,
	outDir: "dist",
	declarationDir: "dist",
});
