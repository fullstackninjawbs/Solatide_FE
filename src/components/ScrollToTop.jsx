import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { captureAttribution } from '../utils/attribution';

export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }, 100); // Small delay to allow Suspense/lazy components to mount
    
    captureAttribution();
    
    return () => clearTimeout(timer);
  }, [pathname, search]);

  return null;
}
