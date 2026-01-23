import { defineConfig } from "vitepress";
import llmstxt from "vitepress-plugin-llms";
import { withSidebar } from "vitepress-sidebar";

// https://vitepress.dev/reference/site-config
export default withSidebar(
	defineConfig({
		title: "MIDL.js",
		lastUpdated: true,
		description:
			"A JavaScript library that makes it easy to interact with the Bitcoin and MIDL Protocol",
		head: [
			[
				"link",
				{
					rel: "icon",
					href: "/favicon.png",
				},
			],
		],
		themeConfig: {
			siteTitle: "JS SDK",
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
			footer: {
				copyright: "Copyright © 2025 MIDL LABS Inc",

				message:
					"Released under the <a href='https://github.com/midl-xyz/midl-js/blob/main/LICENSE'>MIT License</a>",
			},
		},
		cleanUrls: true,
		rewrites: {
			"midl/:slug*": ":slug*",
		},
		srcExclude: ["./examples"],
		markdown: {
			math: true,
		},
		vite: {
			esbuild: {
				target: "esnext",
			},
			plugins: [llmstxt()],
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
