"use client";

import {
  ChevronDown,
  Headphones,
  LocateFixed,
  MapPin,
  Music2,
  Navigation,
  Radio,
  SlidersHorizontal,
  Star
} from "lucide-react";
import { OptionPill } from "@/components/option-pill";
import { VenueCard } from "@/components/venue-card";
import { musicTasteProfiles } from "@/data/music-taste-profiles";
import {
  budgetOptions,
  contextOptions,
  dressCodeOptions,
  musicOptions,
  venueTypeOptions,
  vibeOptions
} from "@/data/preference-options";
import { captureEvent } from "@/lib/analytics";
import { defaultProfile, getRecommendedVenues } from "@/lib/recommendation-engine";
import type {
  Budget,
  DressCode,
  GroupContext,
  MusicProvider,
  MusicStyle,
  MusicTasteProfile,
  PreferenceProfile,
  Venue,
  VenueType,
  Vibe
} from "@/lib/types";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

const cityOptions = ["Düsseldorf", "Köln", "Essen"];
const panelClass = "rounded-lg border border-white/10 bg-[#11141d]/88 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur";

type HomeClientProps = {
  initialVenues: Venue[];
};

export function HomeClient({ initialVenues }: HomeClientProps) {
  const [profile, setProfile] = useState<PreferenceProfile>(defaultProfile);
  const [city, setCity] = useState("Düsseldorf");
  const [locationStatus, setLocationStatus] = useState("Düsseldorf MVP data");
  const [isLocating, setIsLocating] = useState(false);
  const [musicTaste, setMusicTaste] = useState<MusicTasteProfile | null>(null);
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "complete">("idle");
  const [activeProvider, setActiveProvider] = useState<MusicProvider | null>(null);
  const [musicError, setMusicError] = useState<string | null>(null);
  const recommendations = useMemo(() => getRecommendedVenues(initialVenues, profile), [initialVenues, profile]);
  const bestMatch = recommendations[0];

  const loadSpotifyTaste = useCallback(async () => {
    setActiveProvider("Spotify");
    setMusicTaste(null);
    setMusicError(null);
    setScanStatus("scanning");

    try {
      const response = await fetch("/api/spotify/taste");

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as { error?: string; hint?: string } | null;
        throw new Error(errorPayload?.hint ?? "Spotify is connected, but your taste profile could not be loaded.");
      }

      const data = (await response.json()) as {
        profile: MusicTasteProfile;
      };

      setMusicTaste(data.profile);
      setScanStatus("complete");
      captureEvent("Music Scan Completed", {
        provider: "Spotify",
        confidence: data.profile.confidence,
        topGenres: data.profile.topGenres.join(", ")
      });
      setProfile((current) => ({
        ...current,
        music: data.profile.topGenres,
        vibe: data.profile.energy
      }));
    } catch (error) {
      setScanStatus("idle");
      const errorMessage = error instanceof Error ? error.message : "Spotify is connected, but your taste profile could not be loaded.";
      setMusicError(errorMessage);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const spotifyStatus = params.get("spotify");

    if (!spotifyStatus) {
      return;
    }

    window.history.replaceState({}, "", window.location.pathname);

    if (spotifyStatus === "connected") {
      loadSpotifyTaste();
      return;
    }

    setActiveProvider("Spotify");
    setScanStatus("idle");
    setMusicError("Spotify connection failed. Try again or use the manual filters.");
  }, [loadSpotifyTaste]);

  function toggleMusic(style: MusicStyle) {
    captureEvent("Preference Changed", {
      field: "music",
      value: style
    });
    setProfile((current) => ({
      ...current,
      music: current.music.includes(style)
        ? current.music.filter((item) => item !== style)
        : [...current.music, style]
    }));
  }

  function requestLocation() {
    captureEvent("Location Requested", {
      city
    });

    if (!("geolocation" in navigator)) {
      setLocationStatus("Location unavailable. Pick a city manually.");
      return;
    }

    setIsLocating(true);
    setLocationStatus("Checking your location...");

    navigator.geolocation.getCurrentPosition(
      () => {
        setIsLocating(false);
        setCity("Düsseldorf");
        setLocationStatus("Location detected. Showing Düsseldorf MVP matches.");
      },
      () => {
        setIsLocating(false);
        setLocationStatus("Location blocked. Choose your city manually.");
      },
      {
        enableHighAccuracy: true,
        timeout: 8000
      }
    );
  }

  function analyzeMusicTaste(provider: MusicProvider) {
    setMusicError(null);

    if (provider === "Spotify") {
      captureEvent("Music Scan Started", {
        provider,
        mode: "oauth"
      });
      setActiveProvider(provider);
      setScanStatus("scanning");
      window.location.href = "/api/spotify/login";
      return;
    }

    const taste = musicTasteProfiles[provider];
    captureEvent("Music Scan Started", {
      provider,
      mode: "preview"
    });
    setActiveProvider(provider);
    setMusicTaste(null);
    setScanStatus("scanning");

    window.setTimeout(() => {
      setMusicTaste(taste);
      setScanStatus("complete");
      captureEvent("Music Scan Completed", {
        provider,
        confidence: taste.confidence,
        topGenres: taste.topGenres.join(", ")
      });
      setProfile((current) => ({
        ...current,
        music: taste.topGenres,
        vibe: taste.energy
      }));
    }, 900);
  }

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="sticky top-0 z-20 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-night/88 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div>
            <div className="text-2xl font-black tracking-normal text-white">NITEFY</div>
            <p className="mt-1 text-sm font-semibold text-white/58">Don&apos;t guess the night. NITEFY it.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3 py-2 text-xs font-bold text-white/78">
              <MapPin size={14} className="text-cyan" />
              {city}
            </span>
            <span className="rounded-full bg-lime px-3 py-2 text-xs font-black text-night">MVP</span>
            <a href="#recommendations" className="rounded-full bg-white px-4 py-2 text-xs font-black text-night transition hover:bg-lime lg:hidden">
              See matches
            </a>
          </div>
        </header>

        <section className="grid gap-5 py-5 lg:grid-cols-[390px_minmax(0,1fr)]">
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <section className={panelClass}>
              <StepLabel number="1" label="Music taste" icon={<Headphones size={17} />} />
              <h1 className="mt-3 text-4xl font-black leading-[0.98] text-white">Tonight starts with your sound.</h1>
              <p className="mt-3 text-sm leading-6 text-white/68">
                Pick a provider preview and NITEFY builds a nightlife profile from your music taste.
              </p>

              <div className="mt-5 grid gap-2">
                {(["Spotify", "Apple Music", "SoundCloud"] as MusicProvider[]).map((provider) => (
                  <button
                    key={provider}
                    type="button"
                    onClick={() => analyzeMusicTaste(provider)}
                    disabled={scanStatus === "scanning"}
                    className={`rounded-lg border p-4 text-left transition ${
                      musicTaste?.provider === provider || activeProvider === provider
                        ? "border-lime bg-lime text-night shadow-glow"
                        : "border-white/12 bg-black/24 text-white hover:border-lime/60 hover:bg-white/[0.08]"
                    } ${scanStatus === "scanning" ? "cursor-wait opacity-90" : ""}`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-base font-black">{provider}</span>
                      <Music2 size={18} />
                    </span>
                    <span className={`mt-1 block text-sm ${musicTaste?.provider === provider || activeProvider === provider ? "text-night/70" : "text-white/58"}`}>
                      {activeProvider === provider && scanStatus === "scanning"
                        ? provider === "Spotify"
                          ? "Connecting Spotify..."
                          : "Analyzing taste..."
                        : provider === "Spotify"
                          ? "Connect for real matching"
                          : "Preview music-based matching"}
                    </span>
                    <span className={`mt-3 flex flex-wrap gap-1.5 ${musicTaste?.provider === provider || activeProvider === provider ? "text-night/70" : "text-white/54"}`}>
                      {musicTasteProfiles[provider].topGenres.map((genre) => (
                        <span key={genre} className="rounded-full border border-current/20 px-2 py-0.5 text-[11px] font-black">
                          {genre}
                        </span>
                      ))}
                    </span>
                  </button>
                ))}
              </div>

              {musicError ? (
                <p className="mt-4 rounded-lg border border-red-400/25 bg-red-400/10 px-3 py-2 text-sm font-bold text-red-100">
                  {musicError}
                </p>
              ) : null}

              {scanStatus === "scanning" ? (
                <div className="mt-5 border-t border-white/10 pt-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-black text-lime">
                    <Radio size={16} />
                    Scanning {activeProvider}
                  </div>
                  <ScanStep label="Reading recent genres" active />
                  <ScanStep label="Detecting nightlife energy" active />
                  <ScanStep label="Matching venues nearby" active />
                </div>
              ) : null}

              {musicTaste ? (
                <div className="mt-5 border-t border-white/10 pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-white">{musicTaste.provider} taste profile</p>
                      <p className="mt-1 text-xs font-bold text-white/48">{musicTaste.listeningWindow}</p>
                    </div>
                    <div className="rounded-lg bg-lime px-3 py-2 text-right text-night shadow-glow">
                      <p className="text-[10px] font-black uppercase">Confidence</p>
                      <p className="text-lg font-black">{musicTaste.confidence}%</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/70">{musicTaste.summary}</p>

                  <div className="mt-4">
                    <p className="text-xs font-black uppercase text-cyan">Top artists signal</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {musicTaste.topArtists.map((artist) => (
                        <span key={artist} className="rounded-full bg-cyan/10 px-3 py-1 text-xs font-bold text-cyan">
                          {artist}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {musicTaste.signals.map((signal) => (
                      <span key={signal} className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-bold text-white/78">
                        {signal}
                      </span>
                    ))}
                  </div>

                  <p className="mt-4 text-sm leading-6 text-white/74">{musicTaste.nightlifeTranslation}</p>
                </div>
              ) : null}
            </section>

            <section className={panelClass}>
              <StepLabel number="2" label="Tonight" icon={<SlidersHorizontal size={17} />} />

              <PreferenceBlock title="Music">
                {musicOptions.map((style) => (
                  <OptionPill key={style} label={style} active={profile.music.includes(style)} onClick={toggleMusic} />
                ))}
              </PreferenceBlock>

              <PreferenceBlock title="Vibe">
                {vibeOptions.map((vibe) => (
                  <OptionPill
                    key={vibe}
                    label={vibe}
                    active={profile.vibe === vibe}
                    onClick={(value: Vibe) => {
                      captureEvent("Preference Changed", {
                        field: "vibe",
                        value
                      });
                      setProfile((current) => ({ ...current, vibe: value }));
                    }}
                  />
                ))}
              </PreferenceBlock>

              <PreferenceBlock title="Budget">
                {budgetOptions.map((budget) => (
                  <OptionPill
                    key={budget}
                    label={budget}
                    active={profile.budget === budget}
                    onClick={(value: Budget) => {
                      captureEvent("Preference Changed", {
                        field: "budget",
                        value
                      });
                      setProfile((current) => ({ ...current, budget: value }));
                    }}
                  />
                ))}
              </PreferenceBlock>

              <div className="mb-4">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <h3 className="text-sm font-black text-white/86">Distance</h3>
                  <span className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-black text-white/76">
                    {profile.distanceKm} km
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  step="1"
                  value={profile.distanceKm}
                  onChange={(event) => {
                    const distanceKm = Number(event.target.value);
                    captureEvent("Preference Changed", {
                      field: "distance",
                      value: distanceKm
                    });
                    setProfile((current) => ({ ...current, distanceKm }));
                  }}
                  className="h-2 w-full cursor-pointer accent-lime"
                  aria-label="Distance preference"
                />
              </div>

              <details
                className="group border-t border-white/10 pt-4"
                onToggle={(event) => {
                  if (event.currentTarget.open) {
                    captureEvent("Advanced Filters Opened");
                  }
                }}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-black text-cyan">
                  Advanced filters
                  <ChevronDown size={16} className="transition group-open:rotate-180" />
                </summary>

                <div className="mt-4">
                  <PreferenceBlock title="Dress code">
                    {dressCodeOptions.map((dressCode) => (
                      <OptionPill
                        key={dressCode}
                        label={dressCode}
                        active={profile.dressCode === dressCode}
                        onClick={(value: DressCode) => {
                          captureEvent("Preference Changed", {
                            field: "dressCode",
                            value
                          });
                          setProfile((current) => ({ ...current, dressCode: value }));
                        }}
                      />
                    ))}
                  </PreferenceBlock>

                  <PreferenceBlock title="Place type">
                    {venueTypeOptions.map((venueType) => (
                      <OptionPill
                        key={venueType}
                        label={venueType}
                        active={profile.venueType === venueType}
                        onClick={(value: VenueType | "Any") => {
                          captureEvent("Preference Changed", {
                            field: "venueType",
                            value
                          });
                          setProfile((current) => ({ ...current, venueType: value }));
                        }}
                      />
                    ))}
                  </PreferenceBlock>

                  <PreferenceBlock title="Tonight with">
                    {contextOptions.map((context) => (
                      <OptionPill
                        key={context}
                        label={context}
                        active={profile.context === context}
                        onClick={(value: GroupContext) => {
                          captureEvent("Preference Changed", {
                            field: "context",
                            value
                          });
                          setProfile((current) => ({ ...current, context: value }));
                        }}
                      />
                    ))}
                  </PreferenceBlock>
                </div>
              </details>
            </section>

            <section className={panelClass}>
              <StepLabel number="3" label="Location" icon={<LocateFixed size={17} />} />
              <div className="mt-3 flex flex-wrap gap-2">
                {cityOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      captureEvent("Location City Selected", {
                        city: option
                      });
                      setCity(option);
                      setLocationStatus(option === "Düsseldorf" ? "Showing Düsseldorf MVP data" : "Manual city selected. Venue data coming next.");
                    }}
                    className={`rounded-full border px-3 py-2 text-xs font-black transition ${
                      city === option ? "border-cyan bg-cyan text-night" : "border-white/12 bg-white/[0.06] text-white/74"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={requestLocation}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-black text-night transition hover:bg-lime"
              >
                <Navigation size={16} />
                {isLocating ? "Checking..." : "Use my location"}
              </button>
              <p className="mt-3 text-sm leading-6 text-white/62">{locationStatus}</p>
            </section>
          </aside>

          <section id="recommendations" className="min-w-0 scroll-mt-24">
            <div className="mb-4 rounded-lg border border-white/10 bg-[#0d1018]/88 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase text-lime">Your night profile</p>
                  <h2 className="mt-2 text-3xl font-black leading-tight text-white sm:text-4xl">
                    {musicTaste ? `${musicTaste.provider} taste, ${profile.vibe.toLowerCase()} vibe` : "Choose a music scan to start"}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/64">
                    {musicTaste
                      ? musicTaste.nightlifeTranslation
                      : "You can still use the manual filters, but the clearest NITEFY experience starts with music taste."}
                  </p>
                </div>
                <div className="grid min-w-[150px] grid-cols-2 overflow-hidden rounded-lg border border-white/10 bg-white/[0.05] text-center">
                  <div className="border-r border-white/10 px-3 py-3">
                    <p className="text-[10px] font-black uppercase text-lime">Best</p>
                    <p className="mt-1 text-2xl font-black text-white">{bestMatch?.matchScore ?? 0}%</p>
                  </div>
                  <div className="px-3 py-3">
                    <p className="text-[10px] font-black uppercase text-cyan">Rating</p>
                    <p className="mt-1 flex items-center justify-center gap-1 text-2xl font-black text-white">
                      <Star size={16} className="fill-lime text-lime" />
                      {bestMatch?.rating.toFixed(1) ?? "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {profile.music.slice(0, 4).map((style) => (
                  <span key={style} className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-bold text-white/78">
                    {style}
                  </span>
                ))}
                <span className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-bold text-white/78">{profile.budget} budget</span>
                <span className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-bold text-white/78">{profile.distanceKm} km radius</span>
              </div>

              {musicTaste ? (
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {musicTaste.recommendationImpact.map((impact) => (
                    <div key={impact} className="rounded-lg border border-white/10 bg-white/[0.05] p-3 text-sm font-semibold leading-5 text-white/72">
                      {impact}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-lime">Recommended now</p>
                <h2 className="mt-1 text-2xl font-black text-white">{recommendations.length} places near {city}</h2>
              </div>
              <p className="text-sm text-white/58">Sorted by fit, rating and distance</p>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {recommendations.map((venue, index) => (
                <VenueCard key={venue.id} venue={venue} featured={index === 0} />
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function StepLabel({ number, label, icon }: { number: string; label: string; icon: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-xs font-black uppercase text-lime">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-lime text-night">{number}</span>
      <span className="text-lime">{label}</span>
      <span className="text-cyan">{icon}</span>
    </div>
  );
}

function ScanStep({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="mb-2 flex items-center gap-3 text-sm font-semibold text-white/76">
      <span className={`h-2.5 w-2.5 rounded-full ${active ? "bg-lime shadow-glow" : "bg-white/20"}`} />
      {label}
    </div>
  );
}

function PreferenceBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="mb-3 text-sm font-black text-white/86">{title}</h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
