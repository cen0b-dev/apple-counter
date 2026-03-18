import { useState, useCallback, useEffect, useRef } from 'react';
import { haptic } from '../utils/haptics.js';

export function useHoldRepeat(cb) {
  const tmRef = useRef(null);
  const [rpt, setRpt] = useState(false);
  const touchStartY = useRef(null);
  const cancelled = useRef(false);

  const start = useCallback(
    (startY) => {
      touchStartY.current = startY ?? null;
      cancelled.current = false;
      cb();
      let delay = 380;
      const loop = () => {
        if (cancelled.current) return;
        cb();
        haptic('step');
        delay = Math.max(55, delay * 0.72);
        tmRef.current = setTimeout(loop, delay);
      };
      tmRef.current = setTimeout(() => {
        if (cancelled.current) return;
        setRpt(true);
        loop();
      }, 380);
    },
    [cb]
  );

  const cancel = useCallback(() => {
    cancelled.current = true;
    clearTimeout(tmRef.current);
    setRpt(false);
    touchStartY.current = null;
  }, []);

  const onTouchMove = useCallback(
    (e) => {
      if (touchStartY.current == null) return;
      const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
      if (dy > 8) cancel();
    },
    [cancel]
  );

  useEffect(() => () => clearTimeout(tmRef.current), []);

  return { repeating: rpt, start, stop: cancel, onTouchMove };
}
