import { useEffect, useState } from 'react';
import { googleOptimize } from 'constants/';

declare global {
  interface Window {
    dataLayer: any;
    google_optimize: any;
  }
}

// 반환되는 variant가 1인 경우 변경된 페이지를 렌더링합니다.
export const useOptimize = (): number | undefined => {
  const [variant, setVariant] = useState<number>();

  useEffect(() => {
    window.dataLayer.push({ event: 'optimize.activate' });
    const interval = setInterval(() => {
      if (window.google_optimize !== undefined) {
        const variant = window.google_optimize.get(googleOptimize.experimentId);
        if (typeof variant !== 'undefined') {
          setVariant(Number(variant));
        }
        clearInterval(interval);
      }
    }, 100);
  }, []);

  return variant;
};
