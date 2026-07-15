import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

 

                                                  

                                                                           

 
export const useScrollRestoration = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    

    return () => {
      sessionStorage.setItem(`scrollPos_${pathname}`, window.scrollY.toString());
    };
  }, [pathname]);

  useEffect(() => {
    

    const savedPosition = sessionStorage.getItem(`scrollPos_${pathname}`);
    if (savedPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition, 10));
      }, 0);
    }
  }, [pathname]);
};

export default useScrollRestoration;
