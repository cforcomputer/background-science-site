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

export const metadata = {
  title: 'Research — Background Science',
  description: 'How we work, what we believe, and the kind of problems we like.',
};

const areas = [
  {
    title: 'Physical systems',
    body: 'Sensing, control, and instrumentation for processes that have to actually work in the world.',
  },
  {
    title: 'Applied probability',
    body: 'Forecasting under uncertainty. Decision systems that quantify what they do not know.',
  },
  {
    title: 'Industrial software',
    body: 'Systems for engineers and operators. Tools that survive contact with reality.',
  },
  {
    title: 'Machine learning',
    body: 'Models scoped to specific decisions, with honest evaluation. No demoware.',
  },
];

const beliefs = [
  {
    n: '01',
    title: 'A working prototype is the strongest argument.',
    body: 'We would rather show than tell. The fastest path to clarity is usually a thing you can run.',
  },
  {
    n: '02',
    title: 'Write everything down.',
    body: 'Memos outlive meetings. We treat clear writing as part of the deliverable, not overhead.',
  },
  {
    n: '03',
    title: 'Generalists ship.',
    body: 'The best research engineers we know are generalists who go deep when it matters. We hire for taste and range.',
  },
  {
    n: '04',
    title: 'Honesty over polish.',
    body: 'We will tell you when an approach will not work, when a deadline is unrealistic, and when you should hire someone else.',
  },
];

export default function Research() {
  return (
    <>
      <Section size="4">
        <Container size="3" px="5">
          <Text size="2" color="gray" weight="medium" style={{ letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            Research
          </Text>
          <Heading
            as="h1"
            size="9"
            weight="medium"
            mt="3"
            style={{ letterSpacing: '-0.035em', lineHeight: 1.05 }}
          >
            We treat every project as a small research program.
          </Heading>
          <Text as="p" size="5" color="gray" mt="5" style={{ maxWidth: '62ch', lineHeight: 1.55 }}>
            That means a clearly stated question, a hypothesis worth testing, a
            written record of what we tried, and an artifact at the end that
            you can keep using.
          </Text>
        </Container>
      </Section>

      <Section size="4">
        <Container size="4" px="5">
          <Heading as="h2" size="7" weight="medium" mb="6" style={{ letterSpacing: '-0.02em' }}>
            Areas we like
          </Heading>
          <Grid columns={{ initial: '1', sm: '2' }} gap="4">
            {areas.map((a) => (
              <Card key={a.title} size="4" variant="surface">
                <Flex direction="column" gap="2" p="3">
                  <Heading as="h3" size="5" weight="medium">
                    {a.title}
                  </Heading>
                  <Text as="p" size="3" color="gray" style={{ lineHeight: 1.6 }}>
                    {a.body}
                  </Text>
                </Flex>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section size="4">
        <Container size="3" px="5">
          <Heading as="h2" size="7" weight="medium" mb="6" style={{ letterSpacing: '-0.02em' }}>
            What we believe
          </Heading>
          <Flex direction="column" gap="6">
            {beliefs.map((b) => (
              <Box key={b.n} style={{ borderTop: '1px solid var(--gray-a4)', paddingTop: 'var(--space-5)' }}>
                <Grid columns={{ initial: '1', sm: '6' }} gap="4">
                  <Text size="2" color="gray" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {b.n}
                  </Text>
                  <Box className="mobile-grid-span" style={{ gridColumn: 'span 5' }}>
                    <Heading as="h3" size="5" weight="medium" mb="2" style={{ letterSpacing: '-0.015em' }}>
                      {b.title}
                    </Heading>
                    <Text as="p" size="3" color="gray" style={{ maxWidth: '60ch', lineHeight: 1.6 }}>
                      {b.body}
                    </Text>
                  </Box>
                </Grid>
              </Box>
            ))}
          </Flex>
        </Container>
      </Section>

      <Section size="4">
        <Container size="3" px="5">
          <Flex direction="column" gap="4" align="start">
            <Heading as="h3" size="7" weight="medium" style={{ letterSpacing: '-0.02em' }}>
              If this sounds like the way you want to work…
            </Heading>
            <Button size="4" asChild>
              <Link href="/contact">Tell us about your problem</Link>
            </Button>
          </Flex>
        </Container>
      </Section>
    </>
  );
}
