// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeBasePaths from './src/utils/rehype-base-paths.mjs';

const SITE_URL = 'https://ryanhuang114.github.io';
const BASE_PATH = '/personalwebsite';

// https://astro.build/config
export default defineConfig({
	site: SITE_URL,
	base: BASE_PATH,
	markdown: {
		// Astro 7 uses Sätteri by default. The unified processor is required for
		// remark/rehype plugins such as math rendering.
		processor: unified({
			remarkPlugins: [remarkMath],
			rehypePlugins: [
				rehypeKatex,
				// Keep root-relative links and images from Markdown under the
				// GitHub Pages repository path.
				[rehypeBasePaths, { base: BASE_PATH }],
			],
			// Preserve authored punctuation and language exactly as written.
			smartypants: false,
			gfm: true,
		}),
	},
});
