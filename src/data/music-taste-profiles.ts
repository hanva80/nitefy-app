import type { MusicTasteProfile } from "@/lib/types";

export const musicTasteProfiles: Record<MusicTasteProfile["provider"], MusicTasteProfile> = {
  Spotify: {
    provider: "Spotify",
    topGenres: ["Afrobeats", "Hip-hop", "R&B"],
    energy: "High energy",
    summary: "Your recent taste points to danceable tracks, bass-heavy nights and social rooms.",
    signals: ["Afrobeats rotation", "Hip-hop playlists", "Late-night R&B"]
  },
  "Apple Music": {
    provider: "Apple Music",
    topGenres: ["House", "Pop", "Latin"],
    energy: "Dance",
    summary: "Your library leans toward bright, rhythmic tracks and places where the group can move early.",
    signals: ["House mixes", "Latin favorites", "Pop repeats"]
  }
};
