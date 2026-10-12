// Robots directives. Every page renders exactly ONE <meta name="robots"> via Helmet
// (index.html no longer carries a static robots meta), so 404s get a single noindex.
export const ROBOTS_INDEX = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
export const ROBOTS_NOINDEX = 'noindex, nofollow';

export const SITE_ORIGIN = 'https://solatidebiosciences.com.au';
