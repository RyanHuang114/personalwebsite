import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Entries are stored as three-digit Markdown filenames. The generated ID is
 * the filename without its extension, which keeps stable URLs such as
 * `/articles/001/` when new entries are added later.
 */
const sequentialLoader = (folder: 'research' | 'articles' | 'ideas') =>
	glob({
		pattern: '*.md',
		base: `./src/content/${folder}`,
		generateId: ({ entry }) => entry.replace(/\.md$/, ''),
	});

const about = defineCollection({
	loader: glob({
		pattern: 'about.md',
		base: './src/content',
		generateId: () => 'about',
	}),
	schema: z.object({
		title: z.string().min(1),
		description: z.string().optional(),
	}),
});

const publicationLink = z.object({
	label: z.string().min(1),
	url: z.url(),
});

const research = defineCollection({
	loader: sequentialLoader('research'),
	schema: z.object({
		title: z.string().min(1),
		date: z.coerce.date(),
		description: z.string().min(1),
		field: z.string().min(1),
		status: z.string().min(1),
		doi: z.url().optional(),
		publicationLinks: z.array(publicationLink).default([]),
	}),
});

const articles = defineCollection({
	loader: sequentialLoader('articles'),
	schema: z.object({
		title: z.string().min(1),
		date: z.coerce.date(),
		description: z.string().min(1),
		tags: z.array(z.string()).default([]),
	}),
});

/**
 * Only entries explicitly marked `public` are listed or given a route.
 * This is not an encryption system: do not put sensitive plaintext in a
 * private entry until a secure workflow is implemented.
 */
const ideas = defineCollection({
	loader: sequentialLoader('ideas'),
	schema: z.object({
		title: z.string().min(1),
		date: z.coerce.date(),
		description: z.string().optional(),
		tags: z.array(z.string()).default([]),
		visibility: z.enum(['public', 'private']).default('public'),
	}),
});

export const collections = {
	about,
	research,
	articles,
	ideas,
};
