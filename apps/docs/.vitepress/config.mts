import { defineConfig } from "vitepress";
import { withSidebar } from "vitepress-sidebar";

// https://vitepress.dev/reference/site-config
export default withSidebar(
	defineConfig({
		title: "MIDL.js",
		description:
			"A JavaScript library that makes it easy to interact with the Bitcoin and MIDL Protocol",
		themeConfig: {
			search: {
				provider: "local",
			},
			// https://vitepress.dev/reference/default-theme-config
			nav: [
				{ text: "Home", link: "/" },
				{ text: "Docs", link: "/intro" },
			],

			socialLinks: [
				{ icon: "github", link: "https://github.com/vuejs/vitepress" },
			],
		},
	}),
	{
		useTitleFromFrontmatter: true,
		excludePattern: ["generated"],
		useFolderTitleFromIndexFile: true,
		useFolderLinkFromIndexFile: true,
		sortMenusByFrontmatterOrder: true,
		useTitleFromFileHeading: true,
		collapsed: true,
	},
);
