import { venues as fallbackVenues } from "@/data/venues";
import { createClient } from "@/lib/supabase/server";
import { mapVenueRow } from "@/lib/supabase/venues";
import type { Venue } from "@/lib/types";
import { HomeClient } from "./home-client";

export const revalidate = 300;

export default async function Home() {
  const venues = await getVenues();

  return <HomeClient initialVenues={venues} />;
}

async function getVenues(): Promise<Venue[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return fallbackVenues;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("venues").select("*").eq("is_active", true).order("rating", {
      ascending: false
    });

    if (error || !data?.length) {
      return fallbackVenues;
    }

    return data.map(mapVenueRow);
  } catch {
    return fallbackVenues;
  }
}
