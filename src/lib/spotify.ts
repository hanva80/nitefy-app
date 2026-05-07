import type { MusicStyle, MusicTasteProfile, Vibe } from "@/lib/types";

export type SpotifyArtist = {
  name: string;
  genres: string[];
};

export type SpotifyTrack = {
  name: string;
  artists: Array<{
    name: string;
  }>;
};

const genreSignals: Array<{
  style: MusicStyle;
  matches: string[];
}> = [
  {
    style: "Afrobeats",
    matches: ["afro", "afrobeats", "amapiano", "azonto"]
  },
  {
    style: "Hip-hop",
    matches: ["hip hop", "rap", "trap", "drill"]
  },
  {
    style: "R&B",
    matches: ["r&b", "rnb", "soul"]
  },
  {
    style: "House",
    matches: ["house", "dance", "edm", "electronic"]
  },
  {
    style: "Techno",
    matches: ["techno", "minimal"]
  },
  {
    style: "Latin",
    matches: ["latin", "reggaeton", "urbano", "bachata", "salsa"]
  },
  {
    style: "Pop",
    matches: ["pop"]
  }
];

export function buildSpotifyTasteProfile(artists: SpotifyArtist[], tracks: SpotifyTrack[]): MusicTasteProfile {
  const styleScores = new Map<MusicStyle, number>();
  const rawGenres = artists.flatMap((artist) => artist.genres);

  rawGenres.forEach((genre) => {
    const normalizedGenre = genre.toLowerCase();
    genreSignals.forEach(({ style, matches }) => {
      if (matches.some((match) => normalizedGenre.includes(match))) {
        styleScores.set(style, (styleScores.get(style) ?? 0) + 1);
      }
    });
  });

  if (tracks.length >= 6) {
    styleScores.set("Charts", (styleScores.get("Charts") ?? 0) + 1);
  }

  const topGenres = Array.from(styleScores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([style]) => style)
    .slice(0, 3);

  const resolvedGenres: MusicStyle[] = topGenres.length > 0 ? topGenres : ["Charts", "Pop", "House"];
  const energy = getNightlifeVibe(resolvedGenres);
  const topArtists = artists.slice(0, 4).map((artist) => artist.name);
  const topTracks = tracks.slice(0, 3).map((track) => track.name);
  const confidence = Math.min(96, 70 + artists.length * 2 + Math.min(rawGenres.length, 12));

  return {
    provider: "Spotify",
    topGenres: resolvedGenres,
    energy,
    summary: `Your Spotify taste points to ${resolvedGenres.slice(0, 2).join(" and ").toLowerCase()} nights with a ${energy.toLowerCase()} crowd.`,
    signals: buildSignals(rawGenres, topTracks),
    confidence,
    topArtists: topArtists.length > 0 ? topArtists : ["Spotify top artists"],
    listeningWindow: "Spotify top items, recent weeks",
    nightlifeTranslation: getNightlifeTranslation(resolvedGenres, energy),
    recommendationImpact: [
      `Boosts ${resolvedGenres.slice(0, 2).join(" and ").toLowerCase()} venues`,
      `Prioritizes ${energy.toLowerCase()} rooms over generic nightlife picks`,
      "Keeps recommendations tied to actual listening behavior"
    ]
  };
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

  if (genres.includes("Afrobeats") || genres.includes("Hip-hop")) {
    return "High energy";
  }

  return "Dance";
}

function buildSignals(genres: string[], tracks: string[]) {
  const genreSignals = Array.from(new Set(genres)).slice(0, 3);
  const trackSignals = tracks.slice(0, Math.max(0, 3 - genreSignals.length)).map((track) => `${track} repeat`);
  const signals = [...genreSignals, ...trackSignals];

  return signals.length > 0 ? signals : ["Spotify listening history", "Recent top tracks", "Artist affinity"];
}

function getNightlifeTranslation(genres: MusicStyle[], vibe: Vibe) {
  if (genres.includes("Techno")) {
    return "Best for darker rooms, serious sound systems and places where the music leads the night.";
  }

  if (genres.includes("Latin") || genres.includes("Afrobeats")) {
    return "Best for social places where dancing starts early and the room feels warm, rhythmic and easy to join.";
  }

  if (genres.includes("Hip-hop") || genres.includes("R&B")) {
    return "Best for polished rooms with bass-heavy music, recognizable hooks and a crowd that came to move.";
  }

  return `Best for ${vibe.toLowerCase()} places with accessible music, visual energy and a crowd that fits your current taste.`;
}
