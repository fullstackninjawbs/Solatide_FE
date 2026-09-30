import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

/**
 * GlobalCanonical — a universal canonical tag component.
 * 
 * Placed at the top of the route tree, it ensures EVERY page gets a correct
 * canonical URL pointing to the production domain, with trailing slashes stripped.
 * 
 * Individual page components (ProductDetail, StaticSEO, DynamicPage, research pages)
 * can override this with their own more specific <Helmet> canonical if needed,
 * because react-helmet-async uses a "last wins" strategy for duplicate tags.
 * 
 * The NotFound component overrides this by injecting noindex + removing canonical.
 */
const PROD_ORIGIN = 'https://solatidebiosciences.com.au';

const GlobalCanonical = () => {
  const location = useLocation();

  // Normalize: strip trailing slash (unless it's the root '/')
  let path = location.pathname;
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  const canonicalUrl = `${PROD_ORIGIN}${path}`;

  return (
    <Helmet>
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:url" content={canonicalUrl} />
    </Helmet>
  );
};

export default GlobalCanonical;
