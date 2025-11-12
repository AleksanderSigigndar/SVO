import { useCallback } from 'react';

export const useSmoothScroll = () => {
  const scrollToElement = useCallback((elementId, offset = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const scrollTop = absoluteElementTop - offset;
      
      window.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  }, []);

  return scrollToElement;
};