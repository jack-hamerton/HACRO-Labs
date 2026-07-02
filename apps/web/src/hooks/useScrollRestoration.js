import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to save and restore scroll position
 * Saves scroll position when leaving a page and restores it when returning
 */
export const useScrollRestoration = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Save scroll position to sessionStorage when component unmounts or route changes
    return () => {
      sessionStorage.setItem(`scrollPos_${pathname}`, window.scrollY.toString());
    };
  }, [pathname]);

  useEffect(() => {
    // Restore scroll position when page loads
    const savedPosition = sessionStorage.getItem(`scrollPos_${pathname}`);
    if (savedPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition, 10));
      }, 0);
    }
  }, [pathname]);
};

export default useScrollRestoration;
