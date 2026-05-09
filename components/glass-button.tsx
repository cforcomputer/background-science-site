'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import styles from './glass-button.module.css';

interface Props {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
}

export function GlassButton({ children, href, onClick }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let raf = 0;
    let mx = 0.5;
    let my = 0.5;

    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    const update = () => {
      raf = 0;
      const scroll = clamp(window.scrollY / Math.max(window.innerHeight, 1));
      root.style.setProperty('--mx', `${(mx * 100).toFixed(1)}%`);
      root.style.setProperty('--my', `${(my * 100).toFixed(1)}%`);
      root.style.setProperty('--scroll-x', `${(24 + scroll * 56).toFixed(1)}%`);
      root.style.setProperty('--glow-shift', `${((scroll - 0.5) * 32).toFixed(1)}%`);
    };
    const requestUpdate = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      mx = clamp((event.clientX - rect.left) / rect.width);
      my = clamp((event.clientY - rect.top) / rect.height);
      requestUpdate();
    };
    const onPointerLeave = () => {
      mx = 0.5;
      my = 0.5;
      requestUpdate();
    };

    update();
    root.addEventListener('pointermove', onPointerMove, { passive: true });
    root.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

  const inner = (
    <>
      <span className={styles.label}>{children}</span>
      <span className={styles.arrow} aria-hidden>→</span>
    </>
  );

  return (
    <div ref={rootRef} className={styles.border}>
      {href ? (
        <a href={href} className={styles.button}>{inner}</a>
      ) : (
        <button className={styles.button} onClick={onClick}>{inner}</button>
      )}
    </div>
  );
}
