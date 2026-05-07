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
  TextArea,
  TextField,
} from '@radix-ui/themes';

export const metadata = {
  title: 'Contact — Background Science',
  description: 'Tell us what you are working on.',
};

export default function Contact() {
  return (
    <>
      <Section size="4">
        <Container size="3" px="5">
          <Text size="2" color="gray" weight="medium" style={{ letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            Contact
          </Text>
          <Heading
            as="h1"
            size="9"
            weight="medium"
            mt="3"
            style={{ letterSpacing: '-0.035em', lineHeight: 1.05 }}
          >
            Tell us what you are working on.
          </Heading>
          <Text as="p" size="5" color="gray" mt="5" style={{ maxWidth: '60ch', lineHeight: 1.55 }}>
            We read every message. If we are the right people for it, we will
            reply within a few days. If we are not, we will tell you who is.
          </Text>
        </Container>
      </Section>

      <Section size="4">
        <Container size="4" px="5">
          <Grid columns={{ initial: '1', md: '5' }} gap="6">
            <Box style={{ gridColumn: 'span 3' }}>
              <Card size="4" variant="surface">
                <Box p="3">
                  <form action="mailto:hello@backgroundscience.com" method="post" encType="text/plain">
                    <Flex direction="column" gap="4">
                      <Field label="Your name" name="name">
                        <TextField.Root size="3" name="name" placeholder="Ada Lovelace" />
                      </Field>
                      <Field label="Email" name="email">
                        <TextField.Root size="3" name="email" type="email" placeholder="you@company.com" required />
                      </Field>
                      <Field label="Company" name="company">
                        <TextField.Root size="3" name="company" placeholder="Optional" />
                      </Field>
                      <Field label="What are you working on?" name="message">
                        <TextArea size="3" name="message" placeholder="A few sentences is plenty. We will reply with questions." rows={6} required />
                      </Field>
                      <Box mt="2">
                        <Button size="4" type="submit">Send</Button>
                      </Box>
                    </Flex>
                  </form>
                </Box>
              </Card>
            </Box>

            <Box style={{ gridColumn: 'span 2' }}>
              <Flex direction="column" gap="6">
                <ContactBlock label="Email">
                  <Text size="3" asChild>
                    <a href="mailto:hello@backgroundscience.com" style={{ textDecoration: 'none' }}>
                      hello@backgroundscience.com
                    </a>
                  </Text>
                </ContactBlock>
                <ContactBlock label="Engagements">
                  <Text size="3" color="gray" style={{ lineHeight: 1.6 }}>
                    Most projects start with a 30-minute call to scope the
                    problem. There&apos;s no charge and no commitment.
                  </Text>
                </ContactBlock>
                <ContactBlock label="Press & general">
                  <Text size="3" asChild>
                    <a href="mailto:hello@backgroundscience.com" style={{ textDecoration: 'none' }}>
                      hello@backgroundscience.com
                    </a>
                  </Text>
                </ContactBlock>
              </Flex>
            </Box>
          </Grid>
        </Container>
      </Section>
    </>
  );
}

function Field({
  label,
  name,
  children,
}: {
  label: string;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <Flex direction="column" gap="2" asChild>
      <label htmlFor={name}>
        <Text size="2" color="gray" weight="medium">
          {label}
        </Text>
        {children}
      </label>
    </Flex>
  );
}

function ContactBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box style={{ borderTop: '1px solid var(--gray-a4)', paddingTop: 'var(--space-3)' }}>
      <Text as="div" size="1" color="gray" mb="2" style={{ letterSpacing: '0.14em', textTransform: 'uppercase' }}>
        {label}
      </Text>
      {children}
    </Box>
  );
}
