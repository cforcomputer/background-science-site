'use client';

import styles from './glass-button.module.css';

interface Props {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export function GlassButton({ children, href, onClick }: Props) {
  const inner = (
    <>
      {children}
      <span className={styles.arrow} aria-hidden>→</span>
    </>
  );

  return (
    <div className={styles.border}>
      {href ? (
        <a href={href} className={styles.button}>{inner}</a>
      ) : (
        <button className={styles.button} onClick={onClick}>{inner}</button>
      )}
    </div>
  );
}
