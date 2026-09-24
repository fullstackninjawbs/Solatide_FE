import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { captureAttribution } from '../utils/attribution';

export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useLayoutEffect(() => {
    // Scroll instantly before the browser paints the new page
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
    
    captureAttribution();
  }, [pathname, search]);

  return null;
}
