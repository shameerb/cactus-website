import fs from "node:fs";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@tailwindcss/vite";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import robotsTxt from "astro-robots-txt";
import webmanifest from "astro-webmanifest";
import { defineConfig, envField } from "astro/config";
import { expressiveCodeOptions } from "./src/site.config";
import { siteConfig } from "./src/site.config";

// Remark plugins
import remarkDirective from "remark-directive"; /* Handle ::: directives as nodes */
import { remarkAdmonitions } from "./src/plugins/remark-admonitions"; /* Add admonitions */
import { remarkReadingTime } from "./src/plugins/remark-reading-time";

// Rehype plugins
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeUnwrapImages from "rehype-unwrap-images";

// https://astro.build/config
export default defineConfig({
	site: 'https://shameerb.com',
	base: '/',
	trailingSlash: 'always',
	build: {
		format: 'directory'
	},
	image: {
		domains: ["webmention.io"],
	},
	integrations: [
		expressiveCode(expressiveCodeOptions),
		icon(),
		sitemap(),
		mdx(),
		robotsTxt(),
		webmanifest({
			name: siteConfig.title,
			short_name: siteConfig.title,
			description: siteConfig.description,
			lang: siteConfig.lang,
			theme_color: "#FFF1E5",
			background_color: "#FFF1E5",
			icon: "public/icon.svg",
			icons: [
				{
					src: "icons/favicon-16x16.png",
					sizes: "16x16",
					type: "image/png"
				},
				{
					src: "icons/favicon-32x32.png",
					sizes: "32x32",
					type: "image/png"
				},
				{
					src: "icons/apple-touch-icon.png",
					sizes: "180x180",
					type: "image/png"
				},
				{
					src: "icons/android-chrome-192x192.png",
					sizes: "192x192",
					type: "image/png"
				},
				{
					src: "icons/android-chrome-512x512.png",
					sizes: "512x512",
					type: "image/png"
				}
			],
			start_url: "/",
			display: "standalone",
		}),
	],
	markdown: {
		rehypePlugins: [
			rehypeHeadingIds,
			[rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: ["not-prose"] } }],
			[
				rehypeExternalLinks,
				{
					rel: ["noreferrer", "noopener"],
					target: "_blank",
				},
			],
			rehypeUnwrapImages,
		],
		remarkPlugins: [remarkReadingTime, remarkDirective, remarkAdmonitions],
		remarkRehype: {
			footnoteLabelProperties: {
				className: [""],
			},
		},
	},
	// https://docs.astro.build/en/guides/prefetch/
	prefetch: true,
	vite: {
		optimizeDeps: {
			exclude: ["@resvg/resvg-js"],
		},
		plugins: [tailwind(), rawFonts([".ttf", ".woff"])],
	},
	env: {
		schema: {
			WEBMENTION_API_KEY: envField.string({ context: "server", access: "secret", optional: true }),
			WEBMENTION_URL: envField.string({ context: "client", access: "public", optional: true }),
			WEBMENTION_PINGBACK: envField.string({ context: "client", access: "public", optional: true }),
		},
	},
});

function rawFonts(ext: string[]) {
	return {
		name: "vite-plugin-raw-fonts",
		// @ts-expect-error:next-line
		transform(_, id) {
			if (ext.some((e) => id.endsWith(e))) {
				const buffer = fs.readFileSync(id);
				return {
					code: `export default ${JSON.stringify(buffer)}`,
					map: null,
				};
			}
		},
	};
}
