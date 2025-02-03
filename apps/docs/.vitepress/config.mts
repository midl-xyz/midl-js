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
				{ text: "MIDL", link: "/midl/docs" },
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
			"root/:slug*": ":slug*",
		},
	}),
	[
		{
			useTitleFromFrontmatter: true,
			useFolderTitleFromIndexFile: true,
			sortMenusByFrontmatterOrder: true,
			collapseDepth: 3,
			useTitleFromFileHeading: true,
			useFolderLinkFromIndexFile: false,
			scanStartPath: "root",
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
			scanStartPath: "midl",
			basePath: "/midl/",
			resolvePath: "/midl/",
		},
	],
);
