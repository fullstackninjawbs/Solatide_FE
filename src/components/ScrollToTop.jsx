import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { captureAttribution } from '../utils/attribution';

export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    captureAttribution();
  }, [pathname, search]);

  return null;
}
