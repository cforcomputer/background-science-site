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
  Separator,
  Text,
} from '@radix-ui/themes';

export const metadata = {
  title: 'Services — Background Science',
  description:
    'Data science consulting and R&D for companies building things that do not exist yet.',
};

const services = [
  {
    title: 'Data science',
    summary:
      'Models that earn their keep. Forecasting, optimization, anomaly detection, and applied machine learning, scoped to a specific decision and measured against it.',
    items: [
      'Forecasting and time-series modeling',
      'Optimization and decision systems',
      'Statistical analysis and experiment design',
      'Applied ML and lightweight LLM integration',
    ],
  },
  {
    title: 'Software R&D',
    summary:
      'When the system you need does not exist yet. We design, prototype, and harden custom software where off-the-shelf falls short.',
    items: [
      'Simulation and modeling engines',
      'Custom internal tooling and dashboards',
      'Data infrastructure and pipelines',
      'Backend systems and APIs',
    ],
  },
  {
    title: 'Hardware R&D',
    summary:
      'A working prototype beats a thick spec. We build the physical artifact end-to-end, including the firmware and software that turn it into a product.',
    items: [
      'Sensor systems and instrumentation',
      'Embedded firmware (C, Rust, Zephyr)',
      'Control systems and automation',
      'Rapid prototyping and PoC builds',
    ],
  },
  {
    title: 'Technical advisory',
    summary:
      'When you do not need a build, you need a second opinion. Architecture reviews, R&D roadmaps, hiring help, and teardowns of work done elsewhere.',
    items: [
      'Architecture and system reviews',
      'R&D strategy and roadmapping',
      'Diligence for technical investments',
      'Interim CTO / head of research',
    ],
  },
];

export default function Services() {
  return (
    <>
      <Section size="4">
        <Container size="3" px="5">
          <Text size="2" color="gray" weight="medium" style={{ letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            Services
          </Text>
          <Heading
            as="h1"
            size="9"
            weight="medium"
            mt="3"
            style={{ letterSpacing: '-0.035em', lineHeight: 1.05 }}
          >
            Research and engineering, on demand.
          </Heading>
          <Text as="p" size="5" color="gray" mt="5" style={{ maxWidth: '62ch', lineHeight: 1.55 }}>
            Engagements typically run from a few weeks of focused work to
            multi-quarter R&D programs. We are happy to start small.
          </Text>
        </Container>
      </Section>

      <Section size="4">
        <Container size="4" px="5">
          <Grid columns={{ initial: '1', md: '2' }} gap="5">
            {services.map((s) => (
              <Card key={s.title} size="4" variant="surface">
                <Flex direction="column" gap="4" p="3">
                  <Heading as="h2" size="6" weight="medium" style={{ letterSpacing: '-0.02em' }}>
                    {s.title}
                  </Heading>
                  <Text as="p" size="3" color="gray" style={{ lineHeight: 1.6 }}>
                    {s.summary}
                  </Text>
                  <Separator size="4" />
                  <Box>
                    {s.items.map((i, idx) => (
                      <Flex key={i} align="center" gap="3" py="2" style={{
                        borderTop: idx === 0 ? 'none' : '1px solid var(--gray-a3)',
                      }}>
                        <Text size="2" color="gray" style={{ fontVariantNumeric: 'tabular-nums' }}>
                          {String(idx + 1).padStart(2, '0')}
                        </Text>
                        <Text size="3">{i}</Text>
                      </Flex>
                    ))}
                  </Box>
                </Flex>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section size="4">
        <Container size="3" px="5">
          <Flex direction="column" gap="4" align="start">
            <Heading as="h3" size="7" weight="medium" style={{ letterSpacing: '-0.02em' }}>
              Not sure what you need?
            </Heading>
            <Text as="p" size="4" color="gray" style={{ maxWidth: '56ch', lineHeight: 1.55 }}>
              Most of our best engagements started with a half-formed question.
              Send it over.
            </Text>
            <Button size="4" asChild>
              <Link href="/contact">Get in touch</Link>
            </Button>
          </Flex>
        </Container>
      </Section>
    </>
  );
}
