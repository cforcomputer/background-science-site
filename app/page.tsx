import Link from 'next/link';
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  Section,
  Text,
} from '@radix-ui/themes';
import { Hero } from '@/components/hero';

const capabilities = [
  {
    title: 'Data science',
    body: 'Forecasting, optimization, statistical modeling, and machine learning, applied to real industrial and commercial problems.',
  },
  {
    title: 'Software R&D',
    body: 'Custom systems where off-the-shelf falls short — simulation engines, internal tools, and infrastructure that needs to be exactly right.',
  },
  {
    title: 'Hardware R&D',
    body: 'Sensors, controls, embedded systems, and prototyping. We build the physical thing, and the software that makes it useful.',
  },
];

const principles = [
  { title: 'Small teams', body: 'A senior researcher and an engineer, working with you directly.' },
  { title: 'Written down', body: 'Memos and notebooks, not slides. Decisions you can audit later.' },
  { title: 'Real artifacts', body: 'Working code, working hardware, working models — not concept decks.' },
  { title: 'Quiet rigor', body: 'No theatrics. Just careful work that holds up.' },
];

export default function Home() {
  return (
    <>
      <Hero />

      <Section size="4">
        <Container size="3" px="5">
          <Heading
            as="h2"
            size="9"
            weight="medium"
            style={{ letterSpacing: '-0.035em', lineHeight: 1.05 }}
            mb="5"
          >
            A research lab,
            <br />
            working as your team.
          </Heading>
          <Text
            as="p"
            size="5"
            color="gray"
            style={{ maxWidth: '60ch', lineHeight: 1.55 }}
          >
            We are a small group of scientists and engineers building software
            and hardware for companies that want to make something genuinely
            new. We move fast, write things down, and ship.
          </Text>
        </Container>
      </Section>

      <Section size="4">
        <Container size="4" px="5">
          <Flex justify="between" align="end" mb="6" wrap="wrap" gap="3">
            <Heading as="h3" size="7" weight="medium" style={{ letterSpacing: '-0.02em' }}>
              What we do
            </Heading>
            <Text size="2" color="gray" asChild>
              <Link href="/services" style={{ textDecoration: 'none' }}>
                All services →
              </Link>
            </Text>
          </Flex>
          <Grid columns={{ initial: '1', sm: '3' }} gap="4">
            {capabilities.map((c) => (
              <Card key={c.title} size="4" variant="surface">
                <Flex direction="column" gap="3" height="100%">
                  <Heading as="h4" size="5" weight="medium">
                    {c.title}
                  </Heading>
                  <Text as="p" size="3" color="gray" style={{ lineHeight: 1.6 }}>
                    {c.body}
                  </Text>
                </Flex>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section size="4">
        <Container size="4" px="5">
          <Heading as="h3" size="7" weight="medium" mb="6" style={{ letterSpacing: '-0.02em' }}>
            How we work
          </Heading>
          <Grid columns={{ initial: '1', sm: '2', md: '4' }} gap="5">
            {principles.map((p) => (
              <Box key={p.title}>
                <Heading as="h4" size="3" weight="medium" mb="2">
                  {p.title}
                </Heading>
                <Text as="p" size="2" color="gray" style={{ lineHeight: 1.6 }}>
                  {p.body}
                </Text>
              </Box>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section size="4">
        <Container size="3" px="5">
          <Card size="5" variant="surface">
            <Flex direction="column" gap="4" align="start" p="4">
              <Heading as="h3" size="8" weight="medium" style={{ letterSpacing: '-0.025em' }}>
                Have a problem worth thinking about?
              </Heading>
              <Text as="p" size="4" color="gray" style={{ maxWidth: '54ch', lineHeight: 1.55 }}>
                We take on a small number of engagements each year. Tell us
                what you are working on and we will tell you whether we are the
                right people for it.
              </Text>
              <Button size="4" asChild>
                <Link href="/contact">Start a conversation</Link>
              </Button>
            </Flex>
          </Card>
        </Container>
      </Section>
    </>
  );
}
