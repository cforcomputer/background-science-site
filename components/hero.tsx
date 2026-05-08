'use client';

import { useRef } from 'react';
import { GlassText } from './glass-text';
import styles from './hero.module.css';

export function Hero() {
  const wrapperRef = useRef<HTMLElement>(null);

  return (
    <section ref={wrapperRef} className={styles.wrapper} aria-label="Background Science">
      <div className={styles.sticky}>
        <GlassText text={'Background\nScience'} scrollRef={wrapperRef} />
        <h1 className={styles.srOnly}>Background Science</h1>
        <div className={styles.scrollHint} aria-hidden>
          <span className={styles.scrollDot} />
          <span>scroll</span>
        </div>
      </div>
    </section>
  );
}
