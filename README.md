# AI FX Hedging Assistant

A polished fintech MVP that helps users understand foreign exchange exposure and receive AI-assisted hedging suggestions. Built as an educational demo showing how AI can simplify workflows that traditionally require specialist knowledge, spreadsheets, and bank interaction.

**This is an educational tool — not financial advice.**

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel (zero-config)

No external APIs, databases, or authentication required. All logic runs client-side with deterministic mock data.

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the GitHub repository
4. Click **Deploy** — no configuration needed
5. Vercel will auto-detect Next.js and build the app

You'll get a public URL like `https://ai-fx-hedging-assistant.vercel.app`.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # Main page (state + composition)
│   └── globals.css         # Tailwind + custom styles
├── components/
│   ├── Header.tsx          # App header
│   ├── ExposureForm.tsx    # User input form + presets
│   ├── RecommendationCard.tsx  # Strategy recommendation
│   ├── ScenarioAnalysis.tsx    # ±5% scenario cards
│   ├── AIExplanation.tsx   # AI insight panel
│   └── Disclaimer.tsx      # Educational disclaimer
├── lib/
│   ├── types.ts            # Shared TypeScript types
│   ├── hedging-logic.ts    # Deterministic strategy engine
│   ├── scenario-math.ts    # Scenario calculator
│   └── explanation-generator.ts  # Template-based AI explanation
└── data/
    └── presets.ts          # Quick-start demo scenarios
```
