import styles from './hero.module.css';

export function Hero() {
  return (
    <section className={styles.wrapper} aria-label="Background Science">
      <div className={styles.sticky}>
        <div className={styles.stars} aria-hidden />
        <div className={styles.starsFar} aria-hidden />

        <svg
          className={styles.titleSvg}
          viewBox="0 0 1200 440"
          preserveAspectRatio="xMidYMid meet"
          aria-label="Background Science"
          role="img"
        >
          <defs>
            <linearGradient
              id="iridescent"
              x1="0"
              y1="0"
              x2="0"
              y2="440"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#7fdbff" />
              <stop offset="16%" stopColor="#bef7ff" />
              <stop offset="32%" stopColor="#fff4a3" />
              <stop offset="48%" stopColor="#ffb086" />
              <stop offset="64%" stopColor="#ff8ec5" />
              <stop offset="82%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#5b6cff" />
            </linearGradient>
            <linearGradient
              id="iridescentBright"
              x1="0"
              y1="0"
              x2="0"
              y2="440"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#dffaff" />
              <stop offset="50%" stopColor="#fffae8" />
              <stop offset="100%" stopColor="#ebe0ff" />
            </linearGradient>
          </defs>

          <g
            textAnchor="middle"
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{
              fontFamily:
                'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '220px',
              fontWeight: 500,
              letterSpacing: '-0.03em',
            }}
          >
            <text x="595" y="180" fill="none" stroke="rgba(255, 64, 180, 0.55)" strokeWidth="3.5">
              Background
            </text>
            <text x="605" y="180" fill="none" stroke="rgba(64, 200, 255, 0.55)" strokeWidth="3.5">
              Background
            </text>
            <text x="595" y="395" fill="none" stroke="rgba(255, 64, 180, 0.55)" strokeWidth="3.5">
              Science
            </text>
            <text x="605" y="395" fill="none" stroke="rgba(64, 200, 255, 0.55)" strokeWidth="3.5">
              Science
            </text>

            <text x="600" y="180" fill="none" stroke="url(#iridescent)" strokeWidth="3">
              Background
            </text>
            <text x="600" y="395" fill="none" stroke="url(#iridescent)" strokeWidth="3">
              Science
            </text>

            <text x="600" y="180" fill="none" stroke="url(#iridescentBright)" strokeWidth="0.8">
              Background
            </text>
            <text x="600" y="395" fill="none" stroke="url(#iridescentBright)" strokeWidth="0.8">
              Science
            </text>
          </g>
        </svg>

        <div className={styles.scrollHint} aria-hidden>
          <span className={styles.scrollDot} />
          <span>scroll</span>
        </div>
      </div>
    </section>
  );
}
