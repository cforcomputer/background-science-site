'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './hero.module.css';

const palette = [
  '#5FB754', // green
  '#F8B026', // yellow
  '#F58020', // orange
  '#DA4137', // red
  '#963D97', // purple
  '#1F9DDA', // blue
];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const stops = palette.map((_, i) => i / (palette.length - 1));
  const background = useTransform(scrollYProgress, stops, palette);

  return (
    <section ref={ref} className={styles.wrapper} aria-label="Background Science">
      <motion.div className={styles.sticky} style={{ backgroundColor: background }}>
        <div className={styles.glow} aria-hidden />
        <div className={styles.vignette} aria-hidden />
        <h1 className={styles.title}>
          <span className={styles.line}>Background</span>
          <span className={styles.line}>Science</span>
        </h1>
        <div className={styles.scrollHint} aria-hidden>
          <span className={styles.scrollDot} />
          <span>scroll</span>
        </div>
      </motion.div>
    </section>
  );
}
