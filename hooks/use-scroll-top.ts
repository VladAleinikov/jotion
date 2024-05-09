import { useEffect, useState } from 'react'

export const UseScrollTop = (threshold = 10) => {
      const [scrolled, setScrolled] = useState(false);

      useEffect(() => { 
            const scrollHandler = () => {
                  if (window.scrollY > threshold) {
                        setScrolled(true);
                  } else {
                        setScrolled(false);
                  }
            };

            window.addEventListener("scroll", scrollHandler);
            return () => window.removeEventListener("scroll", scrollHandler)
      }, [threshold])
      
      return scrolled;
}
