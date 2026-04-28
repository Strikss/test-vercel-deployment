# Multi-Tenant Vercel Demo

One Vite deployment serves every tenant subdomain. Tenant config is loaded at
runtime through Vercel serverless functions backed by Upstash Redis.

## How It Works

- `*.yourdomain.com` points to the same Vercel project.
- The frontend extracts the subdomain from `window.location.hostname`.
- The frontend calls `/api/tenant?slug=<slug>`.
- The serverless function reads `tenant:<slug>` from Redis.
- Creating a tenant posts to `/api/tenants` and writes Redis config.

No GitHub commit or redeploy is required when a tenant is created.

## Required Environment

Connect Upstash Redis from the Vercel Marketplace, then make sure these env vars
exist in the Vercel project:

```bash
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

The API also supports the older Vercel KV names:

```bash
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

Set the primary wildcard domain used by the frontend:

```bash
VITE_PRIMARY_HOST=yourdomain.com
```

For local testing with subdomains, use:

```bash
VITE_PRIMARY_HOST=localhost
```

Then visit `acme.localhost:5173`.

## Development

```bash
npm install
npm run dev
```

Use `vercel dev` instead when you want to test the `/api/*` serverless routes
locally.

Without Redis env vars, the API returns seed tenants for reads and rejects new
tenant creation. This keeps the demo viewable before storage is connected while
making runtime writes explicit.
