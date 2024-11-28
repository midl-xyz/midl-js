import esbuild from "esbuild";
import { glob } from "glob";
import { execSync } from "node:child_process";

console.log("Cleaning...");

execSync("rm -rf dist/*", { stdio: "inherit" });

console.log("Building...");

execSync("tsc --project tsconfig.json", { stdio: "inherit" });

const entryPoints = glob.sync("./src/**/*.{ts,js,tsx,jsx}", {
	ignore: ["./src/**/*.test.{ts,tsx,js,jsx}", "./src/**/__tests__/**/*"],
});

esbuild
	.build({
		entryPoints,
		outdir: "dist",
		outbase: "src",
		format: "esm",
		sourcemap: true,
		loader: { ".ts": "ts", ".js": "js" },
		target: "esnext",
		minify: true,
	})
	.then(() => {
		console.log("Build completed successfully");
	})
	.catch(() => process.exit(1));
