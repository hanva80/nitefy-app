# NITEFY

**Don't guess the night. NITEFY it.**

NITEFY is a nightlife recommendation app designed to help people discover clubs, bars, events, and party spots that match their personal taste, location, music preferences, vibe, dress code expectations, budget, and mood for the night.

The goal is not to help users find people to party with. The core purpose is to help them find the right place to go out.

## Problem

Choosing where to go out can be frustrating, especially when users are with friends, visiting a new city, or looking for something last minute. Existing tools like Google Maps or Instagram can show places, but they do not truly understand the user's music taste, preferred atmosphere, dress code expectations, or nightlife mood.

## Solution

NITEFY gives users personalized nightlife recommendations based on their preferences, current location, music taste, ratings, and the vibe they are looking for.

The strongest product direction is music-led: users can connect Spotify or Apple Music, NITEFY quickly understands their taste, and that taste becomes a primary recommendation signal.

## MVP Focus

The first version focuses on:

- Demo Spotify and Apple Music taste analysis
- Quick user preference profile
- Location-based recommendations
- Music and vibe matching
- Venue ratings and key information
- Strong visual previews
- Dress code and expectation setting
- Simple and intuitive user experience

## Initial Market

The initial focus is Germany, starting with NRW and cities like Düsseldorf.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Local mock data for the first validation version
- Supabase later if saved venues, real users, ratings, or admin tools become necessary

## Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Long-term Vision

NITEFY aims to become an international nightlife discovery platform where users can find the right place for their night anywhere in the world.
