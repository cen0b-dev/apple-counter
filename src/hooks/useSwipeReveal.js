import { useEffect, useRef, useCallback } from 'react';

export function useSwipeReveal({ rowId, openRowId, onSwipeStart, onDelete }) {
  const ref = useRef(null);
  const startX = useRef(null);
  const startOffset = useRef(0);
  const rafId = useRef(null);
  const lastOffset = useRef(0);
  const dragging = useRef(false);
  const isOpen = openRowId === rowId;
  const REVEAL_MAX = 80;
  const SNAP_THRESHOLD = 32;
  const DELETE_THRESHOLD = 160;

  const getTrack = () => ref.current?.querySelector('.swipe-track');
  const getDeleteBtn = () => ref.current?.querySelector('.swipe-delete');

  const showDelete = () => {
    const btn = getDeleteBtn();
    if (btn) btn.style.opacity = '1';
  };

  const hideDelete = () => {
    const btn = getDeleteBtn();
    if (btn) btn.style.opacity = '0';
  };

  useEffect(() => {
    if (!isOpen) {
      const track = getTrack();
      if (track) {
        track.style.transition = '';
        track.style.transform = '';
      }
      hideDelete();
      startOffset.current = 0;
      lastOffset.current = 0;
    }
  }, [isOpen]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onStart = (e) => {
      const track = getTrack();
      if (!track) return;
      startX.current = e.touches[0].clientX;
      const m = track.style.transform?.match(/-?\d+\.?\d*/);
      startOffset.current = m ? parseFloat(m[0]) : 0;
      dragging.current = true;
      track.style.transition = 'none';
      onSwipeStart?.(rowId);
    };

    const applyRubberBand = (v) => {
      if (v >= -REVEAL_MAX) return v;
      const over = Math.abs(v) - REVEAL_MAX;
      return -(REVEAL_MAX + over * 0.25);
    };

    const onMove = (e) => {
      if (startX.current === null) return;
      const dx = e.touches[0].clientX - startX.current;
      const raw = Math.min(0, startOffset.current + dx);
      const next = applyRubberBand(raw);
      lastOffset.current = next;
      if (Math.abs(next) > 4) showDelete();
      if (rafId.current) return;
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        const t = getTrack();
        if (t) {
          t.style.transform = `translateX(${next}px)`;
        }
      });
    };

    const onEnd = () => {
      const endOffset = lastOffset.current;
      startX.current = null;
      dragging.current = false;
      const track = getTrack();
      if (!track) return;
      track.style.transition = '';

      if (Math.abs(endOffset) >= DELETE_THRESHOLD && onDelete) {
        track.style.transform = `translateX(-100%)`;
        track.style.transition = 'transform .2s ease';
        setTimeout(() => onDelete(), 200);
        return;
      }

      if (endOffset <= -SNAP_THRESHOLD) {
        track.style.transform = `translateX(-${REVEAL_MAX}px)`;
        startOffset.current = -REVEAL_MAX;
        lastOffset.current = -REVEAL_MAX;
        showDelete();
      } else {
        track.style.transform = '';
        startOffset.current = 0;
        lastOffset.current = 0;
        hideDelete();
      }
    };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: true });
    el.addEventListener('touchend', onEnd, { passive: true });
    el.addEventListener('touchcancel', onEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
      el.removeEventListener('touchcancel', onEnd);
    };
  }, [rowId, openRowId, onSwipeStart, onDelete]);

  const reset = useCallback(() => {
    const track = getTrack();
    if (track) {
      track.style.transition = '';
      track.style.transform = '';
    }
    hideDelete();
    startOffset.current = 0;
    lastOffset.current = 0;
  }, []);

  const open = useCallback(() => {
    const track = getTrack();
    if (track) {
      track.style.transition = '';
      track.style.transform = `translateX(-${REVEAL_MAX}px)`;
      startOffset.current = -REVEAL_MAX;
      lastOffset.current = -REVEAL_MAX;
    }
    showDelete();
  }, []);

  return { ref, reset, open };
}
