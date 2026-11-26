// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
	markdown: {
		// Astro 7 uses Sätteri by default. The unified processor is required for
		// remark/rehype plugins such as math rendering.
		processor: unified({
			remarkPlugins: [remarkMath],
			rehypePlugins: [rehypeKatex],
			// Preserve authored punctuation and language exactly as written.
			smartypants: false,
			gfm: true,
		}),
	},
});
