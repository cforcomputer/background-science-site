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

const projects = [
  {
    title: 'The Sourcerer',
    type: 'Industrial sourcing automation',
    body:
      "A production sourcing tool for an industrial automation enterprise client. It searches the internet through web scrapers and site APIs, standardizes article data, and uses internal scores to identify price-matching opportunities before the purchasing team has to look manually. Also, it\'s free. (Our results are monetized through the Ebay Affiliate Program)",
    highlights: [
      'Daily sourcing across competitor sites, marketplaces, and supplier data sources',
      'Internal ranking logic for price matching, deal quality, and purchase priority',
      'Employee notifications when high-confidence sourcing opportunities are found',
    ],
    stats: [
      { label: 'Sourcing speed', value: '97% faster' },
      { label: 'Sourced quantity', value: '3x increase' },
      { label: 'Manual processing', value: '91% less' },
    ],
  },
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
            We are a small group of engineers and designers building software
            and hardware for companies that want to turn their ideas into reality. See your prototype come to life, then decide to scale.
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

      <Section id="projects" size="4" style={{ scrollMarginTop: '88px' }}>
        <Container size="4" px="5">
          <Flex justify="between" align="end" mb="6" wrap="wrap" gap="3">
            <Box>
              <Text size="2" color="gray" weight="medium" style={{ letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                Projects
              </Text>
              <Heading as="h3" size="7" weight="medium" mt="2" style={{ letterSpacing: '-0.02em' }}>
                Proven automation in production.
              </Heading>
            </Box>
          </Flex>

          {projects.map((project) => (
            <Card key={project.title} size="5" variant="surface">
              <Grid columns={{ initial: '1', sm: '12' }} gap="6" align="start">
                <Box className="mobile-grid-span" style={{ gridColumn: 'span 7' }}>
                  <Text as="div" size="2" color="gray" weight="medium" mb="3" style={{ letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    {project.type}
                  </Text>
                  <Heading as="h4" size="7" weight="medium" mb="4" style={{ letterSpacing: '-0.025em' }}>
                    {project.title}
                  </Heading>
                  <Text as="p" size="4" color="gray" style={{ lineHeight: 1.65, maxWidth: '62ch' }}>
                    {project.body}
                  </Text>
                </Box>

                <Flex className="mobile-grid-span" direction="column" gap="5" style={{ gridColumn: 'span 5' }}>
                  <Grid columns={{ initial: '1', sm: '3', md: '1' }} gap="3">
                    {project.stats.map((stat) => (
                      <Box key={stat.label} style={{ borderTop: '1px solid var(--gray-a5)', paddingTop: 'var(--space-3)' }}>
                        <Text as="div" size="6" weight="medium" style={{ letterSpacing: '-0.02em' }}>
                          {stat.value}
                        </Text>
                        <Text as="div" size="2" color="gray" mt="1">
                          {stat.label}
                        </Text>
                      </Box>
                    ))}
                  </Grid>

                  <Box>
                    {project.highlights.map((highlight, idx) => (
                      <Flex
                        key={highlight}
                        align="start"
                        gap="3"
                        py="3"
                        style={{ borderTop: idx === 0 ? '1px solid var(--gray-a4)' : '1px solid var(--gray-a3)' }}
                      >
                        <Text size="2" color="gray" style={{ fontVariantNumeric: 'tabular-nums' }}>
                          {String(idx + 1).padStart(2, '0')}
                        </Text>
                        <Text size="3" style={{ lineHeight: 1.55 }}>
                          {highlight}
                        </Text>
                      </Flex>
                    ))}
                  </Box>
                </Flex>
              </Grid>
            </Card>
          ))}
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
