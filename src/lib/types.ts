export type MusicStyle =
  | "Hip-hop"
  | "Afrobeats"
  | "House"
  | "Techno"
  | "Latin"
  | "Charts"
  | "R&B"
  | "Pop";

export type Vibe =
  | "High energy"
  | "Chic"
  | "Underground"
  | "Relaxed"
  | "Dance"
  | "Student";

export type Budget = "Low" | "Medium" | "High";
export type DressCode = "Casual" | "Smart casual" | "Dressy";
export type VenueType = "Club" | "Bar" | "Event" | "Lounge";
export type GroupContext = "Friends" | "Date" | "Solo" | "Tourist";
export type MusicProvider = "Spotify" | "Apple Music";

export type MusicTasteProfile = {
  provider: MusicProvider;
  topGenres: MusicStyle[];
  energy: Vibe;
  summary: string;
  signals: string[];
  confidence: number;
  topArtists: string[];
  listeningWindow: string;
  nightlifeTranslation: string;
  recommendationImpact: string[];
};

export type PreferenceProfile = {
  music: MusicStyle[];
  vibe: Vibe;
  budget: Budget;
  distanceKm: number;
  dressCode: DressCode;
  venueType: VenueType | "Any";
  context: GroupContext;
};

export type Venue = {
  id: string;
  name: string;
  type: VenueType;
  city: string;
  neighborhood: string;
  distanceKm: number;
  music: MusicStyle[];
  vibes: Vibe[];
  budget: Budget;
  priceLabel: string;
  dressCode: DressCode;
  openingHours: string;
  rating: number;
  image: string;
  visualCue: string;
  description: string;
};

export type VenueMatch = Venue & {
  matchScore: number;
  matchReasons: string[];
};
