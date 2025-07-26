import { useEffect, useRef, useState, useCallback } from "react";

export const useIntersectionObserver = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    console.log('Intersection observer triggered:', entry.isIntersecting);
    setIsVisible(entry.isIntersecting);
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      console.log('No element to observe');
      return;
    }

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      threshold: 0,
      rootMargin: '0px 0px 0px 0px',
    });

    console.log('Starting to observe element');
    observer.observe(element);

    return () => {
      console.log('Disconnecting observer');
      observer.disconnect();
    };
  }, [handleIntersection]);

  return [ref, isVisible] as const;
};
