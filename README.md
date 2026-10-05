# Kennedy Portfolio

## Vercel deployment

Production portfolio data, admin state, and contact messages are stored in Supabase. Uploaded images are stored in a public Supabase Storage bucket. Local development continues to use the JSON files and `public/uploads`.

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL Editor. It creates the state table and public image bucket. The table has row-level security enabled and is only accessed by the server with the service-role key.
3. Add these variables in the Vercel project settings for every environment you deploy:
   - `NEXT_PUBLIC_SITE_URL` — the canonical site URL, including `https://`.
   - `NEXT_PUBLIC_SUPABASE_URL` — the Supabase project URL.
   - `SUPABASE_SERVICE_ROLE_KEY` — the Supabase service-role key. Keep it server-only; never prefix it with `NEXT_PUBLIC_`.
   - `PORTFOLIO_SESSION_SECRET` — a unique random secret with at least 32 characters.
   - `ADMIN_USERNAME` and either `ADMIN_PASSWORD` or `ADMIN_PASSWORD_HASH`.
   - `ADMIN_EMAIL` (or `PORTFOLIO_CONTACT_EMAIL`).
   - `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` for contact notifications and password-reset email.
   - Optionally, `SUPABASE_STORAGE_BUCKET` (defaults to `portfolio-assets`) and `SMTP_FROM`.
4. Link the project with the Vercel CLI and run `vercel env pull .env.local --environment=production`.
5. Run `npm run smtp:check` to verify the SMTP server connection and authentication. Then submit a test through the contact form to confirm actual delivery.
6. Run `npm run deploy:check`. It validates the required values and verifies the Supabase table and public storage bucket. Vercel builds run the same checks automatically and stop before compilation if configuration is incomplete.
7. To preserve the portfolio, contact messages, and current uploaded images, run `npm run migrate:supabase`. It migrates images to Supabase Storage and updates local upload paths to their public URLs in the portfolio data. Existing state keys are skipped; back up or remove the matching Supabase key if you intentionally need to replace it.
8. Deploy with the project root set to this directory. If no migration is run, initial public portfolio data comes from `src/data/portfolio-data.json`, and the contact inbox starts empty. Subsequent admin edits and messages are persisted in Supabase.

The upload endpoint limits images to 4 MB to stay below Vercel's function request-body limit. The image bucket is public for portfolio display; admin uploads still require an authenticated server request. If `SUPABASE_STORAGE_BUCKET` is customized, create a matching public bucket in Supabase Storage.

Run `npm run build` to verify the production build and `npm run lint` for linting.

## Local development

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
