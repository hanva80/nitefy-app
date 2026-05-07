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

- Venue data loads from Supabase when `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are configured, with local fallback data in `src/data/venues.ts`.
- Music taste analysis is simulated in `src/data/music-taste-profiles.ts` with provider, confidence, artist signals, genre signals and recommendation impact.
- Recommendation logic is local and transparent in `src/lib/recommendation-engine.ts`.
- Location uses browser geolocation when available, with manual city fallback.
- Vercel Analytics tracks page views and core MVP events.
- PostHog tracks the same core events, funnels, and session behavior when `NEXT_PUBLIC_POSTHOG_KEY` is configured.
- Supabase client utilities and an initial database schema are included for venues, venue events and early user feedback.

## Environment Variables

Create `.env.local` for local PostHog testing:

```bash
NEXT_PUBLIC_POSTHOG_PROJECT_KEY=your_project_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

The app proxies PostHog requests through `/ingest` to the EU PostHog endpoint.
Run `supabase/schema.sql` in the Supabase SQL Editor to create and seed the MVP tables.

## First Manual Test

1. Open the home screen.
2. Change music, vibe, budget, dress code, venue type and distance.
3. Confirm the recommendation order changes.
4. Open a venue detail page.
5. Confirm the page explains why the venue was recommended.

## Analytics Events

The MVP tracks:

- `Music Scan Started`
- `Music Scan Completed`
- `Preference Changed`
- `Advanced Filters Opened`
- `Location Requested`
- `Location City Selected`
- `Venue Opened`
