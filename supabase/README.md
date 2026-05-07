# Supabase Setup

This MVP uses Supabase as the first real database layer for NITEFY venue data, venue events, and early tester feedback.
The home page and venue detail page read active venues from Supabase when the environment variables are present, and fall back to bundled MVP data if Supabase is not configured yet.

## 1. Create Project

Create a Supabase project in the EU region if possible, then copy:

- Project URL
- Publishable key

## 2. Environment Variables

Add these locally in `.env.local` and in Vercel Project Settings:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

## 3. Create Tables

Open Supabase SQL Editor and run:

```sql
-- paste the contents of supabase/schema.sql
```

## 4. MVP Tables

- `venues`: active nightlife places shown by NITEFY.
- `venue_events`: optional near-term events tied to a venue.
- `user_feedback`: feedback from early testers.

RLS is enabled. Public users can read active venues/events and submit feedback.
