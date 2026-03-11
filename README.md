# Photo Portfolio

Personal photography portfolio built with Next.js and deployed on Vercel.

## Development

```bash
pnpm install
pnpm dev
```

## Verification

```bash
pnpm test
pnpm build
```

## Configuration

Site metadata and social links are defined in `app/config.ts`.

For production SEO/share metadata, set:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

If this variable is not set, the app falls back to Vercel-provided deployment URLs.
