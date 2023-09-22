import { useEffect, useState } from 'react';

declare global {
  interface Window {
    dataLayer: any;
    google_optimize: any;
  }
}

export const useOptimize = (experimentId: string): number | undefined => {
  const [variant, setVariant] = useState<number>();

  useEffect(() => {
    window.dataLayer.push({ event: 'optimize.activate' });
    const interval = setInterval(() => {
      if (window.google_optimize !== undefined) {
        const variant = window.google_optimize.get(experimentId);
        if (typeof variant !== 'undefined') {
          setVariant(Number(variant));
        }
        clearInterval(interval);
      }
    }, 100);
  }, [experimentId]);

  return variant;
};
