/**
 * Rewrites root-relative href/src values in rendered Markdown so that they
 * remain valid when Astro is deployed under a base path such as
 * `/personalwebsite/`.
 *
 * This runs before Astro's internal rehype-raw pass, so both normal Markdown
 * image/link nodes and raw HTML blocks such as <figure><img /></figure> are
 * handled.
 */
const rootRelativePattern = /^\/(?!\/)/;
const rawAttributePattern = /(\s(?:href|src)=)(["'])(\/(?!\/)[^"']*)\2/gi;

function createPathRewriter(base) {
	const normalizedBase = String(base ?? '').replace(/\/$/, '');

	return (value) => {
		if (typeof value !== 'string' || !rootRelativePattern.test(value)) {
			return value;
		}

		if (!normalizedBase) {
			return value;
		}

		if (value === normalizedBase || value.startsWith(`${normalizedBase}/`)) {
			return value;
		}

		return `${normalizedBase}${value}`;
	};
}

export default function rehypeBasePaths(options = {}) {
	const rewrite = createPathRewriter(options.base);
	const rewriteRawHtml = (html) =>
		html.replace(
			rawAttributePattern,
			(_match, attribute, quote, value) => `${attribute}${quote}${rewrite(value)}${quote}`,
		);

	return (tree) => {
		const visit = (node) => {
			if (!node || typeof node !== 'object') {
				return;
			}

			if (node.type === 'raw' && typeof node.value === 'string') {
				node.value = rewriteRawHtml(node.value);
			}

			if (node.type === 'element' && node.properties) {
				for (const property of ['href', 'src']) {
					if (typeof node.properties[property] === 'string') {
						node.properties[property] = rewrite(node.properties[property]);
					}
				}
			}

			if (Array.isArray(node.children)) {
				for (const child of node.children) {
					visit(child);
				}
			}
		};

		visit(tree);
	};
}
