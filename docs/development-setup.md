# Development Setup

## Required Tools

- Node.js 20 or newer
- npm

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Current MVP Notes

- Venue data is local mock data in `src/data/venues.ts`.
- Recommendation logic is local and transparent in `src/lib/recommendation-engine.ts`.
- Location uses browser geolocation when available, with manual city fallback.
- Supabase is intentionally not included yet.

## First Manual Test

1. Open the home screen.
2. Change music, vibe, budget, dress code, venue type and distance.
3. Confirm the recommendation order changes.
4. Open a venue detail page.
5. Confirm the page explains why the venue was recommended.
