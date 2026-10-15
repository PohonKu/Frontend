# PohonKu Frontend

Design checkpoint: the original team identity restored for the bilingual adopter journey. Next.js App Router, TypeScript, Tailwind and GSAP. Login uses Google OAuth through the backend only.

## Run locally

Use Node 22.13+ (CI uses Node 22) and npm. Run `npm ci`, copy `.env.example` to `.env.local`, then `npm run dev`. Open http://localhost:3000/id or /en. Never commit your local environment file.

`NEXT_PUBLIC_API_URL` points to the backend; `.env.example` contains the current Railway URL. A Midtrans sandbox client key is optional for visual development. There is no demo switch or sample-data fallback in the application.

## Verification

Run `npm run check` (lint, TypeScript, adapter/transport tests), then `npm run build`. A clean checkout does not require local secrets to run these checks. Public environment variables are read at build time.

Browser scripts in `tests/browser-*.js` are async functions for Playwright CLI `run-code --filename`. Start the app on port 3000, open a browser session, create `outputs/restoration`, and run scripts sequentially. Journey and state scripts intercept API traffic; they do not test real Google credentials, payment settlement or production admin writes. The polish script intercepts OAuth and checks callback return navigation. Scroll tests cover OS dark mode with active GSAP. Screenshots are local evidence, not application assets.

## Integration and release

See [revision guide](docs/ADOPTER-REVISION.md) for assets, API contracts, motion, and FKT content gaps. Certificates and email need backend delivery; the UI never fabricates them. Production adoption/payment readiness is not claimed by this checkpoint.

Before releasing a Preview, configure the backend CORS allowlist and Google OAuth frontend redirect for its chosen domain. The last verified backend response allowed localhost:3000 only. Production release follows integration review.
