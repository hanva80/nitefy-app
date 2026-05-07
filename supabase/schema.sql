create extension if not exists pgcrypto;

create table if not exists public.venues (
  id text primary key,
  name text not null,
  type text not null check (type in ('Club', 'Bar', 'Event', 'Lounge')),
  city text not null,
  neighborhood text not null,
  distance_km numeric(5, 2) not null default 0,
  music text[] not null default '{}',
  vibes text[] not null default '{}',
  budget text not null check (budget in ('Low', 'Medium', 'High')),
  price_label text not null,
  dress_code text not null check (dress_code in ('Casual', 'Smart casual', 'Dressy')),
  opening_hours text not null,
  rating numeric(2, 1) not null default 0 check (rating >= 0 and rating <= 5),
  image_url text not null,
  visual_cue text not null,
  description text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.venue_events (
  id uuid primary key default gen_random_uuid(),
  venue_id text not null references public.venues(id) on delete cascade,
  title text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  music text[] not null default '{}',
  vibe text,
  price_label text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.user_feedback (
  id uuid primary key default gen_random_uuid(),
  venue_id text references public.venues(id) on delete set null,
  rating integer check (rating between 1 and 5),
  feedback_type text not null default 'general' check (feedback_type in ('venue', 'recommendation', 'location', 'general')),
  message text not null,
  contact_email text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists venues_city_idx on public.venues(city);
create index if not exists venues_type_idx on public.venues(type);
create index if not exists venues_music_idx on public.venues using gin(music);
create index if not exists venues_vibes_idx on public.venues using gin(vibes);
create index if not exists venue_events_venue_id_idx on public.venue_events(venue_id);
create index if not exists user_feedback_venue_id_idx on public.user_feedback(venue_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists venues_set_updated_at on public.venues;
create trigger venues_set_updated_at
before update on public.venues
for each row execute function public.set_updated_at();

alter table public.venues enable row level security;
alter table public.venue_events enable row level security;
alter table public.user_feedback enable row level security;

drop policy if exists "Public can read active venues" on public.venues;
create policy "Public can read active venues"
on public.venues
for select
using (is_active = true);

drop policy if exists "Public can read active venue events" on public.venue_events;
create policy "Public can read active venue events"
on public.venue_events
for select
using (is_active = true);

drop policy if exists "Anyone can submit MVP feedback" on public.user_feedback;
create policy "Anyone can submit MVP feedback"
on public.user_feedback
for insert
with check (char_length(message) between 1 and 2000);

insert into public.venues (
  id, name, type, city, neighborhood, distance_km, music, vibes, budget, price_label,
  dress_code, opening_hours, rating, image_url, visual_cue, description
) values
  ('silq', 'SilQ Club', 'Club', 'Düsseldorf', 'Altstadt', 1.8, array['Hip-hop', 'Afrobeats', 'R&B'], array['High energy', 'Dance', 'Chic'], 'Medium', '€€', 'Smart casual', 'Fri-Sat, 22:30-05:00', 4.6, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80', 'Packed dance floor, polished fits, warm lights', 'A central club for groups who want a high-energy night with hip-hop, R&B and Afrobeats.'),
  ('the-cave', 'The Cave', 'Club', 'Düsseldorf', 'Flingern', 4.2, array['Techno', 'House'], array['Underground', 'Dance', 'High energy'], 'Medium', '€€', 'Casual', 'Fri-Sat, 23:00-06:00', 4.4, 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80', 'Dark room, heavy sound, minimal dress code', 'A raw electronic spot for people who care more about sound and energy than posing.'),
  ('ruby-lounge', 'Ruby Lounge', 'Lounge', 'Düsseldorf', 'MedienHafen', 3.1, array['House', 'Pop', 'R&B'], array['Chic', 'Relaxed'], 'High', '€€€', 'Dressy', 'Thu-Sat, 19:00-02:00', 4.7, 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&q=80', 'Cocktails, sharper outfits, lower-volume music', 'A polished choice for drinks first, dancing later, and a more dressed-up crowd.'),
  ('stadtstrand', 'Stadtstrand Sessions', 'Event', 'Düsseldorf', 'Rheinufer', 2.4, array['House', 'Latin', 'Charts'], array['Relaxed', 'Student', 'Dance'], 'Low', '€', 'Casual', 'Fri-Sun, 17:00-00:00', 4.3, 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80', 'Open air, easy fits, group-friendly tables', 'A relaxed outdoor option for friend groups who want music, drinks and low pressure.'),
  ('neon-bar', 'Neon Bar', 'Bar', 'Düsseldorf', 'Pempelfort', 2.9, array['Pop', 'Charts', 'R&B'], array['Relaxed', 'Student', 'Chic'], 'Medium', '€€', 'Smart casual', 'Wed-Sat, 20:00-03:00', 4.5, 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1200&q=80', 'Color lights, mixed crowd, easy conversation', 'A safe first stop when the group wants options without committing to a full club night.'),
  ('latin-yard', 'Latin Yard', 'Club', 'Düsseldorf', 'Bilk', 5.6, array['Latin', 'Afrobeats', 'Charts'], array['Dance', 'High energy'], 'Medium', '€€', 'Smart casual', 'Fri-Sat, 22:00-04:30', 4.2, 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=80', 'Bright crowd, dancing early, no stiff atmosphere', 'A dance-heavy option for groups who want Latin music, movement and an easygoing mood.')
on conflict (id) do update set
  name = excluded.name,
  type = excluded.type,
  city = excluded.city,
  neighborhood = excluded.neighborhood,
  distance_km = excluded.distance_km,
  music = excluded.music,
  vibes = excluded.vibes,
  budget = excluded.budget,
  price_label = excluded.price_label,
  dress_code = excluded.dress_code,
  opening_hours = excluded.opening_hours,
  rating = excluded.rating,
  image_url = excluded.image_url,
  visual_cue = excluded.visual_cue,
  description = excluded.description,
  is_active = true;
