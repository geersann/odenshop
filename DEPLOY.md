# Independent deployment: Cloudflare Workers

This project no longer depends on Lovable for the Telegram integration or runtime.

## 1. Install

Use Node.js 20+ and npm.

```bash
npm install
```

## 2. Add the missing media files

Put these files into `public/assets/`:

- `valve-product.webp`
- `valve-install-demo.gif`
- `valve-odor-demo.gif`

The original Lovable ZIP contains only metadata for them.

## 3. Authenticate with Cloudflare

```bash
npx wrangler login
```

## 4. Configure Telegram secrets

```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
```

Enter the values when prompted. Do not put the bot token into source code or `.env` files committed to Git.

## 5. Test locally

```bash
npm run dev
```

For a production build preview:

```bash
npm run build
npm run preview
```

## 6. Deploy

```bash
npm run deploy
```

## 7. Connect the domain

In Cloudflare, add `odorfreeukraine.shop` as a zone and point the domain's nameservers at Cloudflare. Then attach the Worker to the custom domain `odorfreeukraine.shop` in Workers > your Worker > Settings > Domains & Routes.

If the domain is already on Cloudflare, no registrar move is required.
