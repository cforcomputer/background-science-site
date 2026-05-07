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
  return (
    <header className={styles.header}>
      <Container size="4" px="5">
        <Flex align="center" justify="between" py="3">
          <Link href="/" className={styles.brand}>
            <Text size="3" weight="medium" style={{ letterSpacing: '-0.01em' }}>
              Background Science
            </Text>
          </Link>
          <nav>
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
        </Flex>
      </Container>
    </header>
  );
}
