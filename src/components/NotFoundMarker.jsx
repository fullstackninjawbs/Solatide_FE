import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { markNotFound } from '../utils/analytics';
import { isPrerendering } from '../utils/routeData';
import { lookupRedirect } from '../utils/redirects';

/**
 * Rendered by every 404 screen (generic, unknown product, unknown CMS page, unknown collection):
 *  - tells the analytics tracker this URL does not exist, so its page view is not recorded
 *    (crawlers probe random URLs such as /<uuid> to test 404 handling);
 *  - checks the Redirects list: if the URL has moved (renamed product/page/collection, legacy
 *    URL), the visitor is sent to the new URL, replacing the history entry.
 * Renders nothing, so it does not change the prerendered HTML.
 */
const NotFoundMarker = () => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    markNotFound();
    if (isPrerendering()) return undefined;
    let cancelled = false;
    lookupRedirect(pathname + search).then((to) => {
      // never "redirect" to the same page (no loops)
      if (!cancelled && to && to.split('?')[0].toLowerCase() !== pathname.toLowerCase()) {
        navigate(to, { replace: true });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [pathname, search, navigate]);
  return null;
};

export default NotFoundMarker;
