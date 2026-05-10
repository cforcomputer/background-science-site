'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container, Flex, Text } from '@radix-ui/themes';
import styles from './nav.module.css';

const links = [
  { href: '/services', label: 'Services' },
  { href: '/research', label: 'Research' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    <header className={styles.header}>
      <Container size="4" px="5">
        <Flex align="center" justify="between" py="3">
          <Link href="/" className={styles.brand} onClick={() => setIsOpen(false)}>
            <Text size="3" weight="medium">
              Background Science
            </Text>
          </Link>
          <nav className={styles.desktopNav} aria-label="Primary">
            <Flex gap="6" align="center">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className={styles.link}>
                  <Text size="2" color="gray">
                    {l.label}
                  </Text>
                </Link>
              ))}
            </Flex>
          </nav>
          <button
            className={styles.menuButton}
            type="button"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            data-open={isOpen ? 'true' : 'false'}
            onClick={() => setIsOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </Flex>
      </Container>
      <div
        id="mobile-menu"
        className={`${styles.mobilePanel} ${isOpen ? styles.mobilePanelOpen : ''}`}
      >
        <Container size="4" px="5">
          <nav className={styles.mobileNav} aria-label="Mobile primary">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={styles.mobileLink}
                onClick={() => setIsOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </Container>
      </div>
    </header>
  );
}
