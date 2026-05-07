import Link from 'next/link';
import { Container, Flex, Grid, Text, Heading } from '@radix-ui/themes';

export function Footer() {
  return (
    <footer
      style={{
        marginTop: 'var(--space-9)',
        borderTop: '1px solid var(--gray-a4)',
        background: 'var(--gray-1)',
      }}
    >
      <Container size="4" px="5" py="8">
        <Grid columns={{ initial: '1', sm: '4' }} gap="6">
          <Flex direction="column" gap="2">
            <Heading as="h4" size="3" weight="medium">
              Background Science
            </Heading>
            <Text size="2" color="gray" style={{ maxWidth: '32ch' }}>
              A research lab, working as your team.
            </Text>
          </Flex>
          <FooterCol title="Company">
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/research">Research</FooterLink>
            <FooterLink href="/services">Services</FooterLink>
          </FooterCol>
          <FooterCol title="Contact">
            <FooterLink href="/contact">Get in touch</FooterLink>
            <Text size="2" color="gray" asChild>
              <a href="mailto:hello@backgroundscience.com">hello@backgroundscience.com</a>
            </Text>
          </FooterCol>
          <FooterCol title="Office">
            <Text size="2" color="gray">
              By appointment
            </Text>
          </FooterCol>
        </Grid>
        <Flex justify="between" align="center" mt="8" pt="5" wrap="wrap" gap="3" style={{ borderTop: '1px solid var(--gray-a3)' }}>
          <Text size="1" color="gray">
            © {new Date().getFullYear()} Background Science
          </Text>
          <Text size="1" color="gray">
            Data science · R&D · Software · Hardware
          </Text>
        </Flex>
      </Container>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Flex direction="column" gap="2">
      <Heading as="h4" size="2" weight="medium" color="gray">
        {title}
      </Heading>
      {children}
    </Flex>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Text size="2" color="gray" asChild>
      <Link href={href} style={{ textDecoration: 'none' }}>
        {children}
      </Link>
    </Text>
  );
}
