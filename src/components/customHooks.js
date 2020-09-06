import { useLayoutEffect, useState } from 'react';

export const useWindowWidth = () => {
  const [width, setWidth] = useState(undefined);
  useLayoutEffect(() => {
    const updateWidth = () => {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', updateWidth);
    updateWidth();
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  return width;
}
