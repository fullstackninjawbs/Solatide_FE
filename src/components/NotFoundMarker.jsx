import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { markNotFound } from '../utils/analytics';

/**
 * Rendered by the 404 screens: tells the analytics tracker this URL does not exist, so its page
 * view is not recorded (crawlers probe random URLs such as /<uuid> to test 404 handling).
 * Renders nothing, so it does not change the prerendered HTML.
 */
const NotFoundMarker = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    markNotFound();
  }, [pathname]);
  return null;
};

export default NotFoundMarker;
