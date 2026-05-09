'use client';

import { useRef } from 'react';
import { GlassText } from './glass-text';
import { GlassButton } from './glass-button';
import styles from './hero.module.css';

export function Hero() {
  const wrapperRef = useRef<HTMLElement>(null);

  return (
    <section ref={wrapperRef} className={styles.wrapper} aria-label="Background Science">
      <div className={styles.sticky}>
        <GlassText text={'BACKGROUND\nSCIENCE'} scrollRef={wrapperRef} fontWeight="600" />
        <h1 className={styles.srOnly}>Background Science</h1>
        <div className={styles.overlay}>
          <p className={styles.tagline}>
            AI automated data collection and sourcing for enterprise.
          </p>
          <GlassButton href="/services">Get started</GlassButton>
        </div>
        <div className={styles.scrollHint} aria-hidden>
          <span className={styles.scrollDot} />
          <span>scroll</span>
        </div>
      </div>
    </section>
  );
}
