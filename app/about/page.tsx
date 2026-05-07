import Link from 'next/link';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Section,
  Text,
} from '@radix-ui/themes';

export const metadata = {
  title: 'About — Background Science',
  description: 'Who we are and why we exist.',
};

const stats = [
  { k: 'Founded', v: '2024' },
  { k: 'Disciplines', v: 'Software · Hardware · Data' },
  { k: 'Team size', v: 'Deliberately small' },
  { k: 'Engagements / year', v: 'Few, focused' },
];

export default function About() {
  return (
    <>
      <Section size="4">
        <Container size="3" px="5">
          <Text size="2" color="gray" weight="medium" style={{ letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            About
          </Text>
          <Heading
            as="h1"
            size="9"
            weight="medium"
            mt="3"
            style={{ letterSpacing: '-0.035em', lineHeight: 1.05 }}
          >
            What if Bell Labs were a startup?
          </Heading>
          <Text as="p" size="5" color="gray" mt="5" style={{ maxWidth: '62ch', lineHeight: 1.55 }}>
            Background Science is a small studio of scientists and engineers
            doing applied research on contract — for companies that want to
            build something that doesn&apos;t exist yet, and don&apos;t want to
            wait years to find out whether it works.
          </Text>
        </Container>
      </Section>

      <Section size="4">
        <Container size="4" px="5">
          <Grid columns={{ initial: '2', sm: '4' }} gap="5">
            {stats.map((s) => (
              <Box key={s.k} style={{ borderTop: '1px solid var(--gray-a5)', paddingTop: 'var(--space-3)' }}>
                <Text as="div" size="1" color="gray" mb="2" style={{ letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  {s.k}
                </Text>
                <Text as="div" size="5" weight="medium" style={{ letterSpacing: '-0.015em' }}>
                  {s.v}
                </Text>
              </Box>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section size="4">
        <Container size="3" px="5">
          <Grid columns={{ initial: '1', sm: '6' }} gap="6">
            <Heading as="h2" size="3" color="gray" weight="medium" style={{ gridColumn: 'span 1', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Why
            </Heading>
            <Box style={{ gridColumn: 'span 5' }}>
              <Text as="p" size="4" mb="4" style={{ lineHeight: 1.7 }}>
                Most consulting firms are built to scale headcount. Most
                research labs are built to publish. Neither is set up to do
                what most ambitious companies actually need: a small group of
                people who can think clearly about a hard problem, build the
                thing, and hand it over working.
              </Text>
              <Text as="p" size="4" color="gray" style={{ lineHeight: 1.7 }}>
                We started Background Science to be that group. Boring name,
                interesting work.
              </Text>
            </Box>
          </Grid>
        </Container>
      </Section>

      <Section size="4">
        <Container size="3" px="5">
          <Grid columns={{ initial: '1', sm: '6' }} gap="6">
            <Heading as="h2" size="3" color="gray" weight="medium" style={{ gridColumn: 'span 1', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Who
            </Heading>
            <Box style={{ gridColumn: 'span 5' }}>
              <Text as="p" size="4" style={{ lineHeight: 1.7 }}>
                Background Science is a small team of researchers and
                engineers with backgrounds in physics, mechanical engineering,
                machine learning, and software systems. We have shipped
                production systems, written papers, and built hardware that
                works in the field. We are senior, and we work hands-on.
              </Text>
            </Box>
          </Grid>
        </Container>
      </Section>

      <Section size="4">
        <Container size="3" px="5">
          <Flex direction="column" gap="4" align="start">
            <Heading as="h3" size="7" weight="medium" style={{ letterSpacing: '-0.02em' }}>
              Want to talk?
            </Heading>
            <Button size="4" asChild>
              <Link href="/contact">Get in touch</Link>
            </Button>
          </Flex>
        </Container>
      </Section>
    </>
  );
}
