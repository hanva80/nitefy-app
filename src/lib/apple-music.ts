import { createSign } from "crypto";
import type { MusicStyle, MusicTasteProfile, Vibe } from "@/lib/types";

export type AppleMusicTrack = {
  attributes?: {
    name?: string;
    artistName?: string;
    genreNames?: string[];
  };
};

export function createAppleMusicDeveloperToken() {
  const teamId = process.env.APPLE_MUSIC_TEAM_ID;
  const keyId = process.env.APPLE_MUSIC_KEY_ID;
  const privateKey = process.env.APPLE_MUSIC_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!teamId || !keyId || !privateKey) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64urlJson({
    alg: "ES256",
    kid: keyId
  });
  const payload = base64urlJson({
    exp: now + 60 * 60 * 12,
    iat: now,
    iss: teamId
  });
  const signingInput = `${header}.${payload}`;
  const signature = createSign("SHA256")
    .update(signingInput)
    .sign({
      dsaEncoding: "ieee-p1363",
      key: privateKey
    });

  return `${signingInput}.${base64url(signature)}`;
}

export function buildAppleMusicTasteProfile(tracks: AppleMusicTrack[]): MusicTasteProfile {
  const genres = tracks.flatMap((track) => track.attributes?.genreNames ?? []).filter(isNonEmptyString);
  const artists = tracks.map((track) => track.attributes?.artistName).filter(isNonEmptyString);
  const trackNames = tracks.map((track) => track.attributes?.name).filter(isNonEmptyString);
  const topGenres = resolveMusicStyles(genres);
  const energy = getNightlifeVibe(topGenres);

  return {
    provider: "Apple Music",
    topGenres,
    energy,
    summary: `Your Apple Music history points to ${topGenres.slice(0, 2).join(" and ").toLowerCase()} places with a ${energy.toLowerCase()} mood.`,
    signals: buildSignals(genres, trackNames),
    confidence: Math.min(94, 68 + tracks.length + Math.min(genres.length, 14)),
    topArtists: unique(artists).slice(0, 4),
    listeningWindow: "Apple Music recently played",
    nightlifeTranslation: getNightlifeTranslation(topGenres, energy),
    recommendationImpact: [
      `Boosts ${topGenres.slice(0, 2).join(" and ").toLowerCase()} venues`,
      "Uses recent listening instead of manual guessing",
      "Keeps the venue match centered on tonight's sound"
    ]
  };
}

function resolveMusicStyles(genres: string[]): MusicStyle[] {
  const scores = new Map<MusicStyle, number>();

  genres.forEach((genre) => {
    const normalized = genre.toLowerCase();

    addScore(scores, normalized, "Afrobeats", ["afro", "afrobeats", "amapiano"]);
    addScore(scores, normalized, "Hip-hop", ["hip-hop", "hip hop", "rap", "trap", "drill"]);
    addScore(scores, normalized, "R&B", ["r&b", "rnb", "soul"]);
    addScore(scores, normalized, "House", ["house", "dance", "electronic", "edm"]);
    addScore(scores, normalized, "Techno", ["techno", "minimal"]);
    addScore(scores, normalized, "Latin", ["latin", "reggaeton", "urbano", "bachata"]);
    addScore(scores, normalized, "Pop", ["pop"]);
  });

  const styles = Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([style]) => style)
    .slice(0, 3);

  return styles.length > 0 ? styles : ["Pop", "R&B", "House"];
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

  if (genres.includes("House") || genres.includes("Latin") || genres.includes("Pop")) {
    return "Dance";
  }

  if (genres.includes("R&B")) {
    return "Chic";
  }

  return "High energy";
}

function buildSignals(genres: string[], tracks: string[]) {
  const genreSignals = unique(genres).slice(0, 3);
  const trackSignals = tracks.slice(0, Math.max(0, 3 - genreSignals.length)).map((track) => `${track} recently played`);

  return [...genreSignals, ...trackSignals].length > 0 ? [...genreSignals, ...trackSignals] : ["Apple Music listening history"];
}

function getNightlifeTranslation(genres: MusicStyle[], vibe: Vibe) {
  if (genres.includes("Latin") || genres.includes("Afrobeats")) {
    return "Best for warm, rhythmic rooms where dancing feels natural and the group can join quickly.";
  }

  if (genres.includes("R&B") || genres.includes("Hip-hop")) {
    return "Best for bass-heavy places with polished energy, recognizable hooks and a social crowd.";
  }

  return `Best for ${vibe.toLowerCase()} places with music that fits what you have actually played recently.`;
}

function base64urlJson(value: Record<string, string | number>) {
  return base64url(Buffer.from(JSON.stringify(value)));
}

function base64url(value: Buffer) {
  return value.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(isNonEmptyString)));
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
