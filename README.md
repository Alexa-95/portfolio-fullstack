# Soft Editorial Portfolio — Cloudflare Worker edition

Next.js 16 + TypeScript portfolio with a Node.js contact API, Cloudflare Turnstile, Upstash Redis rate limiting and a separate Cloudflare Worker that sends email using Cloudflare Email Service (not Nodemailer).

## Set up Next.js

```bash
npm install
cp .env.example .env.local
npm run dev
```

Complete `.env.local` with your Turnstile, Upstash and Worker details. Use a strong random `CONTACT_WORKER_SECRET` of 32+ characters, identical in Next.js and the Worker's secret configuration. Never commit secrets.

## Cloudflare dashboard

1. Add your domain to Cloudflare DNS.
2. In **Compute > Email Service > Email Sending**, onboard your domain. Cloudflare creates SPF/DKIM/DMARC DNS records; wait for verification.
3. In Email Service / Email Routing, add your destination address (for example, your Gmail account) and confirm the verification email. No inbound routing rule is required for simply sending a contact notification.
4. In Turnstile, create a widget authorized for `localhost` and the production hostname. Copy its site key and secret key to Next.js.
5. Create an Upstash Redis database and copy its REST URL and token to Next.js.

## Worker deploy

Edit `worker/wrangler.jsonc`:
- `destination_address` = your verified destination email (binding restricts delivery)
- `EMAIL_TO` = the same destination email
- `EMAIL_FROM` = `contact@your-domain.com` using your onboarded sender domain

```bash
cd worker
npm install
npx wrangler login
npx wrangler secret put CONTACT_WORKER_SECRET
npm run deploy
```

Use the generated `https://...workers.dev` URL for `CONTACT_WORKER_URL` in Next.js `.env.local`. Set `CONTACT_WORKER_SECRET` there to the same value you entered in Wrangler. Local Next.js will call the deployed Worker over HTTPS.

For local Worker development, create `worker/.dev.vars` (copy from `.dev.vars.example`) and run `npm run dev` inside `worker/`. Set `CONTACT_WORKER_URL=http://localhost:8787` in Next.js only for local development. The email binding has `remote: true`, which can connect to Cloudflare for actual sends. Be aware that sending behavior can differ depending on Wrangler and account configuration.

## Test

```bash
# from project root
npm run typecheck
npm run lint
npm run build
npm run dev
```

Go to http://localhost:3000 and send a message. Confirm mailbox delivery (and Spam folder). Check terminal logs and Cloudflare Worker observability if you receive an error. Verify no secrets were committed to Git.

## Security

The browser calls only the Next.js API. Node.js validates data, verifies Turnstile and enforces an Upstash Redis rate limit (3/15 minutes/IP) before calling the Worker. The Worker requires a secret bearer token, validates inputs again, sends to a fixed verified destination and never accepts email destination/sender from form input. Both components fail closed on missing configuration. The Worker rejects cross-origin browser requests that lack the secret. A bearer secret protects the Worker but does not replace the Next.js anti-abuse protections.

Do not rely on client-provided forwarding headers when self hosting Next.js: use a trusted reverse proxy that overwrites them. On Vercel, the platform manages proxy IP headers. For strict per-IP limits, ensure your hosting supplies trusted IP information.

## Project customization

Edit `src/lib/content.ts`, `src/app/page.tsx`, and `src/app/globals.css`. Demo work cards are fictional placeholders and should be replaced before publishing.

## Docs

- https://developers.cloudflare.com/email-service/get-started/send-emails/
- https://developers.cloudflare.com/email-service/configuration/send-bindings/
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
