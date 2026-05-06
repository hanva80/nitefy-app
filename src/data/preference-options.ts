import type { Budget, DressCode, GroupContext, MusicStyle, VenueType, Vibe } from "@/lib/types";

export const musicOptions: MusicStyle[] = [
  "Hip-hop",
  "Afrobeats",
  "House",
  "Techno",
  "Latin",
  "Charts",
  "R&B",
  "Pop"
];

export const vibeOptions: Vibe[] = [
  "High energy",
  "Chic",
  "Underground",
  "Relaxed",
  "Dance",
  "Student"
];

export const budgetOptions: Budget[] = ["Low", "Medium", "High"];
export const dressCodeOptions: DressCode[] = ["Casual", "Smart casual", "Dressy"];
export const venueTypeOptions: Array<VenueType | "Any"> = ["Any", "Club", "Bar", "Event", "Lounge"];
export const contextOptions: GroupContext[] = ["Friends", "Date", "Solo", "Tourist"];
