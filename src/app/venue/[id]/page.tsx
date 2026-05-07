import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Music, Shirt, Star, Ticket } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { venues as fallbackVenues } from "@/data/venues";
import { defaultProfile, getRecommendedVenues } from "@/lib/recommendation-engine";
import { createClient } from "@/lib/supabase/server";
import { mapVenueRow } from "@/lib/supabase/venues";
import type { VenueMatch } from "@/lib/types";
import { notFound } from "next/navigation";
import { VenueViewTracker } from "./venue-view-tracker";

type VenuePageProps = {
  params: {
    id: string;
  };
};

export const revalidate = 300;

export function generateStaticParams() {
  return fallbackVenues.map((venue) => ({ id: venue.id }));
}

export default async function VenuePage({ params }: VenuePageProps) {
  const venue = await getVenue(params.id);

  if (!venue) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <VenueViewTracker
        venueId={venue.id}
        venueName={venue.name}
        matchScore={venue.matchScore}
        venueType={venue.type}
        neighborhood={venue.neighborhood}
        city={venue.city}
      />
      <section className="relative min-h-[58vh] overflow-hidden">
        <Image
          src={venue.image}
          alt={`${venue.name} vibe preview`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/35 to-night/15" />
        <div className="relative mx-auto flex min-h-[58vh] max-w-6xl flex-col justify-between px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex w-fit items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-bold text-white backdrop-blur">
            <ArrowLeft size={16} />
            Back
          </Link>

          <div className="max-w-3xl pb-4">
            <div className="mb-3 inline-flex rounded-full bg-lime px-3 py-1 text-xs font-black text-night">
              {venue.matchScore}% match
            </div>
            <p className="text-sm font-bold uppercase text-white/76">{venue.type} · {venue.neighborhood}, {venue.city}</p>
            <h1 className="mt-2 text-5xl font-black leading-none text-white sm:text-7xl">{venue.name}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/82">{venue.description}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_0.72fr] lg:px-8">
        <div className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
          <h2 className="text-2xl font-black">What to expect</h2>
          <p className="mt-3 text-base leading-7 text-white/74">{venue.visualCue}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <DetailItem icon={<Music size={18} />} label="Music" value={venue.music.join(", ")} />
            <DetailItem icon={<Shirt size={18} />} label="Dress code" value={venue.dressCode} />
            <DetailItem icon={<Ticket size={18} />} label="Price" value={`${venue.priceLabel} · ${venue.budget}`} />
            <DetailItem icon={<Clock size={18} />} label="Hours" value={venue.openingHours} />
            <DetailItem icon={<MapPin size={18} />} label="Distance" value={`${venue.distanceKm.toFixed(1)} km from center`} />
            <DetailItem icon={<Star size={18} />} label="Rating" value={`${venue.rating.toFixed(1)} / 5`} />
          </div>
        </div>

        <aside className="rounded-lg border border-lime/30 bg-lime/10 p-5">
          <h2 className="text-2xl font-black text-white">Why NITEFY picked it</h2>
          <div className="mt-4 space-y-3">
            {venue.matchReasons.map((reason) => (
              <div key={reason} className="rounded-lg border border-white/10 bg-night/50 p-3 text-sm font-bold text-white/86">
                {reason}
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-white/68">
            This is still MVP logic: simple, visible and easy to test with users before making the matching engine more advanced.
          </p>
        </aside>
      </section>
    </main>
  );
}

async function getVenue(id: string): Promise<VenueMatch | undefined> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.from("venues").select("*").eq("id", id).eq("is_active", true).single();

      if (!error && data) {
        return getRecommendedVenues([mapVenueRow(data)], defaultProfile)[0];
      }
    } catch {
      // Fall back to bundled MVP data below.
    }
  }

  return getRecommendedVenues(fallbackVenues, defaultProfile).find((item) => item.id === id);
}

function DetailItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/18 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase text-cyan">
        {icon}
        {label}
      </div>
      <p className="text-sm font-bold text-white">{value}</p>
    </div>
  );
}
