import { defineConfig } from "vitepress";
import { withSidebar } from "vitepress-sidebar";

// https://vitepress.dev/reference/site-config
export default withSidebar(
	defineConfig({
		title: "MIDL.js",

		description:
			"A JavaScript library that makes it easy to interact with the Bitcoin and MIDL Protocol",
		themeConfig: {
			siteTitle: "",
			logo: {
				light: "/logo.svg",
				dark: "/logo-dark.svg",
			},
			search: {
				provider: "local",
			},
			// https://vitepress.dev/reference/default-theme-config
			nav: [
				{ text: "Home", link: "/" },
				{ text: "Docs", link: "/docs" },
				{ text: "SatoshiKit", link: "/satoshi-kit/" },
				{ text: "Core", link: "/core/" },
			],

			socialLinks: [
				{ icon: "github", link: "https://github.com/midl-xyz/midl-js" },
			],
			editLink: {
				pattern:
					"https://github.com/midl-xyz/midl-js/edit/main/apps/docs/:path",
				text: "Edit this page on GitHub",
			},
		},
		cleanUrls: true,
		rewrites: {
			"midl/:slug*": ":slug*",
		},
		srcExclude: ["./examples"],
		vite: {
			esbuild: {
				target: "esnext",
			},
		},
	}),
	[
		{
			useTitleFromFrontmatter: true,
			folderLinkNotIncludesFileName: true,
			useFolderTitleFromIndexFile: true,
			sortMenusByFrontmatterOrder: true,
			collapseDepth: 2,
			useTitleFromFileHeading: true,
			scanStartPath: "midl",
			basePath: "/",
			resolvePath: "/",
		},
		{
			useTitleFromFrontmatter: true,
			folderLinkNotIncludesFileName: true,
			useFolderTitleFromIndexFile: true,
			sortMenusByFrontmatterOrder: true,
			collapseDepth: 2,
			useTitleFromFileHeading: true,
			scanStartPath: "core",
			basePath: "/core/",
			resolvePath: "/core/",
			includeRootIndexFile: true,
		},

		{
			useTitleFromFrontmatter: true,
			folderLinkNotIncludesFileName: true,
			useFolderTitleFromIndexFile: true,
			sortMenusByFrontmatterOrder: true,
			collapseDepth: 2,
			includeRootIndexFile: true,
			useTitleFromFileHeading: true,
			scanStartPath: "satoshi-kit",
			basePath: "/satoshi-kit/",
			resolvePath: "/satoshi-kit/",
		},
	],
);
