import type { PreferenceProfile, Venue, VenueMatch } from "@/lib/types";

export const defaultProfile: PreferenceProfile = {
  music: ["Hip-hop", "Afrobeats"],
  vibe: "High energy",
  budget: "Medium",
  distanceKm: 15,
  dressCode: "Smart casual",
  venueType: "Any",
  context: "Friends"
};

const budgetRank = {
  Low: 1,
  Medium: 2,
  High: 3
};

export function getRecommendedVenues(venues: Venue[], profile: PreferenceProfile): VenueMatch[] {
  return venues
    .map((venue) => {
      let score = 35;
      const reasons: string[] = [];
      const musicMatches = venue.music.filter((style) => profile.music.includes(style));

      if (musicMatches.length > 0) {
        score += 22 + musicMatches.length * 4;
        reasons.push(`Plays ${musicMatches.slice(0, 2).join(" and ")}`);
      }

      if (venue.vibes.includes(profile.vibe)) {
        score += 18;
        reasons.push(`Matches your ${profile.vibe.toLowerCase()} mood`);
      }

      if (venue.distanceKm <= profile.distanceKm) {
        score += 10;
        reasons.push(`${venue.distanceKm.toFixed(1)} km away`);
      }

      if (budgetRank[venue.budget] <= budgetRank[profile.budget]) {
        score += 8;
        reasons.push(`Fits your ${profile.budget.toLowerCase()} budget`);
      }

      if (venue.dressCode === profile.dressCode) {
        score += 7;
        reasons.push(`${venue.dressCode} dress code`);
      }

      if (profile.venueType === "Any" || venue.type === profile.venueType) {
        score += 6;
      }

      return {
        ...venue,
        matchScore: Math.min(score, 98),
        matchReasons: reasons.slice(0, 3)
      };
    })
    .filter((venue) => venue.distanceKm <= profile.distanceKm)
    .sort((a, b) => b.matchScore - a.matchScore || b.rating - a.rating);
}
