import type { MusicTasteProfile } from "@/lib/types";

export const musicTasteProfiles: Record<MusicTasteProfile["provider"], MusicTasteProfile> = {
  Spotify: {
    provider: "Spotify",
    topGenres: ["Afrobeats", "Hip-hop", "R&B"],
    energy: "High energy",
    summary: "Your recent taste points to danceable tracks, bass-heavy nights and social rooms.",
    signals: ["Afrobeats rotation", "Hip-hop playlists", "Late-night R&B"],
    confidence: 91,
    topArtists: ["Burna Boy", "Drake", "SZA", "Rema"],
    listeningWindow: "Last 4 weeks",
    nightlifeTranslation: "Best for places with a lively crowd, warm sound, recognizable hooks and room to dance.",
    recommendationImpact: [
      "Boosts Afrobeats, hip-hop and R&B venues",
      "Prioritizes high-energy rooms over quiet bars",
      "Keeps dress code flexible but polished"
    ]
  },
  "Apple Music": {
    provider: "Apple Music",
    topGenres: ["House", "Pop", "Latin"],
    energy: "Dance",
    summary: "Your library leans toward bright, rhythmic tracks and places where the group can move early.",
    signals: ["House mixes", "Latin favorites", "Pop repeats"],
    confidence: 87,
    topArtists: ["Bad Bunny", "Dua Lipa", "Calvin Harris", "Karol G"],
    listeningWindow: "Recent library and repeats",
    nightlifeTranslation: "Best for upbeat places with accessible music, mixed crowds and dancing that starts early.",
    recommendationImpact: [
      "Boosts house, pop and Latin venues",
      "Prioritizes dance-friendly energy",
      "Pushes relaxed events above strict clubs"
    ]
  },
  SoundCloud: {
    provider: "SoundCloud",
    topGenres: ["Techno", "House", "Hip-hop"],
    energy: "Underground",
    summary: "Your SoundCloud-style profile points to edits, DJ sets and less obvious nightlife choices.",
    signals: ["Electronic sets", "Underground edits", "Bass-heavy discoveries"],
    confidence: 82,
    topArtists: ["Keinemusik", "Fred again..", "Kaytranada", "Skepta"],
    listeningWindow: "Recent likes and plays preview",
    nightlifeTranslation: "Best for rooms with stronger music identity, DJ-led energy and fewer generic chart moments.",
    recommendationImpact: [
      "Boosts underground, house and techno venues",
      "Prioritizes music-led events over polished lounges",
      "Keeps mainstream bars lower unless the vibe is strong"
    ]
  }
};
