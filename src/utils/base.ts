/**
 * Builds internal URLs with Astro's configured base path.
 *
 * Examples with `base: '/personalwebsite'`:
 *   withBase('/')          -> '/personalwebsite/'
 *   withBase('/about/')    -> '/personalwebsite/about/'
 *   withBase('#section')   -> '#section'
 *   withBase('https://…')  -> unchanged
 */
const rawBase = import.meta.env.BASE_URL;
const basePath = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;
const externalUrlPattern = /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i;

export function withBase(path = '/'): string {
	if (!path) {
		return withBase('/');
	}

	if (externalUrlPattern.test(path)) {
		return path;
	}

	const normalizedPath = path.startsWith('/') ? path : `/${path}`;

	if (!basePath) {
		return normalizedPath;
	}

	// Avoid adding the base twice if a content link already includes it.
	if (normalizedPath === basePath || normalizedPath.startsWith(`${basePath}/`)) {
		return normalizedPath;
	}

	return `${basePath}${normalizedPath}`;
}
