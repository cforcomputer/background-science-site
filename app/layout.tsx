import type { Metadata } from 'next';
import { Theme } from '@radix-ui/themes';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '@radix-ui/themes/styles.css';
import './globals.css';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Background Science — Data science & R&D',
  description:
    'A research lab that works like a startup. Data science consulting and R&D services across software and hardware.',
  metadataBase: new URL('https://backgroundscience.example'),
  openGraph: {
    title: 'Background Science',
    description:
      'A research lab that works like a startup. Data science consulting and R&D services across software and hardware.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Theme
          appearance="dark"
          accentColor="indigo"
          grayColor="slate"
          radius="medium"
          scaling="100%"
          panelBackground="translucent"
        >
          <Nav />
          <main>{children}</main>
          <Footer />
        </Theme>
      </body>
    </html>
  );
}
