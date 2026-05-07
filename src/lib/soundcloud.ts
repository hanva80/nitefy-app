import type { MusicStyle, MusicTasteProfile, Vibe } from "@/lib/types";

export type SoundCloudTrack = {
  title?: string;
  genre?: string;
  tag_list?: string;
  user?: {
    username?: string;
  };
};

export function buildSoundCloudTasteProfile(tracks: SoundCloudTrack[]): MusicTasteProfile {
  const genreSignals = tracks
    .flatMap((track) => [track.genre, ...(track.tag_list?.split(/\s+/) ?? [])])
    .filter(isNonEmptyString);
  const artists = tracks.map((track) => track.user?.username).filter(isNonEmptyString);
  const titles = tracks.map((track) => track.title).filter(isNonEmptyString);
  const topGenres = resolveMusicStyles(genreSignals);
  const energy = getNightlifeVibe(topGenres);

  return {
    provider: "SoundCloud",
    topGenres,
    energy,
    summary: `Your SoundCloud likes point to ${topGenres.slice(0, 2).join(" and ").toLowerCase()} nights with a more discovery-led vibe.`,
    signals: buildSignals(genreSignals, titles),
    confidence: Math.min(92, 66 + tracks.length + Math.min(genreSignals.length, 12)),
    topArtists: unique(artists).slice(0, 4),
    listeningWindow: "SoundCloud liked tracks",
    nightlifeTranslation: getNightlifeTranslation(topGenres, energy),
    recommendationImpact: [
      `Boosts ${topGenres.slice(0, 2).join(" and ").toLowerCase()} venues`,
      "Prioritizes music-led venues and events",
      "Uses SoundCloud taste as a signal for less generic nights"
    ]
  };
}

function resolveMusicStyles(signals: string[]): MusicStyle[] {
  const scores = new Map<MusicStyle, number>();

  signals.forEach((signal) => {
    const normalized = signal.toLowerCase().replace(/["#]/g, "");

    addScore(scores, normalized, "Afrobeats", ["afro", "afrobeats", "amapiano"]);
    addScore(scores, normalized, "Hip-hop", ["hiphop", "hip-hop", "hip hop", "rap", "trap", "drill"]);
    addScore(scores, normalized, "R&B", ["r&b", "rnb", "soul"]);
    addScore(scores, normalized, "House", ["house", "dance", "edm", "electronic", "garage"]);
    addScore(scores, normalized, "Techno", ["techno", "minimal", "industrial"]);
    addScore(scores, normalized, "Latin", ["latin", "reggaeton", "bachata"]);
    addScore(scores, normalized, "Pop", ["pop"]);
  });

  const styles = Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([style]) => style)
    .slice(0, 3);

  return styles.length > 0 ? styles : ["Techno", "House", "Hip-hop"];
}

function addScore(scores: Map<MusicStyle, number>, value: string, style: MusicStyle, matches: string[]) {
  if (matches.some((match) => value.includes(match))) {
    scores.set(style, (scores.get(style) ?? 0) + 1);
  }
}

function getNightlifeVibe(genres: MusicStyle[]): Vibe {
  if (genres.includes("Techno")) {
    return "Underground";
  }

  if (genres.includes("House")) {
    return "Dance";
  }

  if (genres.includes("R&B")) {
    return "Chic";
  }

  return "High energy";
}

function buildSignals(genres: string[], tracks: string[]) {
  const genreSignals = unique(genres).slice(0, 3);
  const trackSignals = tracks.slice(0, Math.max(0, 3 - genreSignals.length)).map((track) => `${track} liked`);

  return [...genreSignals, ...trackSignals].length > 0 ? [...genreSignals, ...trackSignals] : ["SoundCloud liked tracks"];
}

function getNightlifeTranslation(genres: MusicStyle[], vibe: Vibe) {
  if (genres.includes("Techno") || genres.includes("House")) {
    return "Best for DJ-led rooms, stronger sound identity and nights that feel less generic.";
  }

  if (genres.includes("Hip-hop") || genres.includes("Afrobeats")) {
    return "Best for energetic rooms with bass, movement and a crowd that reacts to the music.";
  }

  return `Best for ${vibe.toLowerCase()} spots that match the music you actively like on SoundCloud.`;
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(isNonEmptyString)));
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
