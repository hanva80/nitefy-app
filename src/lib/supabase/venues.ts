import type { Venue } from "@/lib/types";
import type { Database } from "./types";

type VenueRow = Database["public"]["Tables"]["venues"]["Row"];

export function mapVenueRow(row: VenueRow): Venue {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    city: row.city,
    neighborhood: row.neighborhood,
    distanceKm: row.distance_km,
    music: row.music as Venue["music"],
    vibes: row.vibes as Venue["vibes"],
    budget: row.budget,
    priceLabel: row.price_label,
    dressCode: row.dress_code,
    openingHours: row.opening_hours,
    rating: row.rating,
    image: row.image_url,
    visualCue: row.visual_cue,
    description: row.description
  };
}
