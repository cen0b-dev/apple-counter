import React, { useCallback, useEffect, useRef } from 'react';
import { useSheetClose } from '../hooks/useSheetClose.js';
import { useSheetDismiss } from '../hooks/useSheetDismiss.js';
import { useFocusTrap } from '../hooks/useFocusTrap.js';
import { haptic } from '../utils/haptics.js';

export function AnimatedSheet({ onClose, children, scrollable = false }) {
  const [closing, triggerClose] = useSheetClose(onClose);
  const drag = useSheetDismiss(triggerClose);
  const focusRef = useFocusTrap(true);

  const sheetRef = useCallback(
    (node) => {
      drag.ref.current = node;
      focusRef.current = node;
    },
    [drag.ref, focusRef]
  );

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      haptic('tap');
      triggerClose();
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') triggerClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [triggerClose]);

  return (
    <div
      className={`sheet-backdrop${closing ? ' closing' : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`sheet${scrollable ? ' scrollable' : ''}`}
        ref={sheetRef}
      >
        {children(triggerClose)}
      </div>
    </div>
  );
}
