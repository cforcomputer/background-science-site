# Background Science

Marketing site for Background Science — data science consulting and R&D services.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Radix UI Themes (consistent component system, dark mode by default)
- Framer Motion (scroll-driven hero)
- Geist (Apple-adjacent typography)

## Local development

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploying with Coolify

This project is configured for Coolify's GitHub deploy using the included `Dockerfile`:

1. Push this repo to GitHub.
2. In Coolify, create a new **Application** → **Public/Private Repository**.
3. Point it at the GitHub repo and branch.
4. Build pack: **Dockerfile** (Coolify auto-detects).
5. Port: `3000`.
6. Deploy.

The Dockerfile uses Next.js standalone output (`output: 'standalone'` in `next.config.ts`) so the production image stays small.

## Pages

- `/` — Home with the scroll-driven glass wordmark hero
- `/services` — What we do
- `/research` — How we work
- `/about` — Who we are
- `/contact` — Get in touch

## Project layout

```
app/                Next.js App Router pages
  layout.tsx        Root layout — Theme provider, fonts, nav, footer
  page.tsx          Home
  services/         Services page
  research/         Research page
  about/            About page
  contact/          Contact page
components/         Shared UI (nav, footer, hero)
```
