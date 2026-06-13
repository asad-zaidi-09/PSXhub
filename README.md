# PSXHub — Pakistan Stock Exchange Investor Guide

PSXHub is a beginner-friendly web app for learning about investing on the Pakistan Stock Exchange (PSX). It includes a sample stock dashboard, a compound-growth calculator, a portfolio tracker, and AI-powered explanations of financial terms and decisions — all written in simple, Pakistani-context language.

The AI features are powered by Claude (Anthropic), called through a small serverless backend so the API key stays private.

## Features

- **Dashboard** — a sample table of PSX stocks with price, change, volume, and P/E, with AI explanations of each company
- **Calculator** — projects investment growth over time, with an AI sanity-check of whether the assumptions are realistic
- **Explainer** — type any financial term or concept and get a simple, Pakistani-context explanation
- **Comparison** — compares PSX stocks against real estate, gold, crypto, and National Savings
- **Portfolio tracker** — add your holdings and get an AI assessment of diversification and risk

## Project structure

```
psxhub/
├── index.html          # Front-end (single page app, vanilla HTML/CSS/JS)
├── api/
│   └── chat.js         # Serverless function that proxies requests to Claude
├── package.json
├── vercel.json
├── .env.example         # Template for required environment variables
└── .gitignore
```

## How the AI features work

The front-end never talks to the Anthropic API directly. Instead, `index.html` sends a prompt to `/api/chat`, which is a serverless function (`api/chat.js`) running on the server. That function holds your real `ANTHROPIC_API_KEY` (read from an environment variable, never exposed to the browser) and forwards the request to Claude, then returns the response text.

This keeps your API key secret and lets you set spending limits in the Anthropic console without worrying about the key leaking from the client-side code.

## Local development

### Prerequisites

- [Node.js](https://nodejs.org) (LTS version)
- [Vercel CLI](https://vercel.com/docs/cli): `npm install -g vercel`
- An Anthropic API key (starts with `sk-ant-`), available from the [Anthropic Console](https://console.anthropic.com)

### Setup

1. Clone this repo and move into the folder:
   ```
   git clone <your-repo-url>
   cd psxhub
   ```

2. Create a `.env` file in the project root (copy `.env.example` and fill in your key):
   ```
   ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
   ```
   **Never commit this file** — it's already excluded via `.gitignore`.

3. Run the local dev server:
   ```
   vercel dev
   ```

4. Open the URL it gives you (usually `http://localhost:3000`) and try the AI buttons.

## Deploying to Vercel

1. Log in (first time only):
   ```
   vercel login
   ```

2. Deploy a preview:
   ```
   vercel
   ```

3. Add your API key as an environment variable on Vercel:
   ```
   vercel env add ANTHROPIC_API_KEY
   ```
   Select **Production** (and Preview, if you'd like) when prompted, then paste your key.

4. Deploy to production:
   ```
   vercel --prod
   ```

Your live site will be available at the URL Vercel provides.

## Cost & safety notes

- This project uses Claude via the Anthropic API, billed per token (input/output).
- It's strongly recommended to set a **monthly spend limit** in the [Anthropic Console](https://console.anthropic.com) (Settings → Limits) so costs can't exceed what you expect.
- The `api/chat.js` function includes a basic prompt-length check as an extra safeguard, but the spend limit is your main protection if the site gets unexpected traffic.

## Tech stack

- Vanilla HTML/CSS/JS front-end (no framework)
- Vercel serverless functions for the backend proxy
- [Claude (Anthropic API)](https://www.anthropic.com) for AI explanations

## License

This project was built for a hackathon demo. Add a license of your choice here (e.g. MIT) if you plan to share or open-source it.
