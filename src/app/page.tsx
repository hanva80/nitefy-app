"use client";

import { LocateFixed, MapPin, Navigation, SlidersHorizontal, Sparkles } from "lucide-react";
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
import { venues } from "@/data/venues";
import { defaultProfile, getRecommendedVenues } from "@/lib/recommendation-engine";
import type {
  Budget,
  DressCode,
  GroupContext,
  MusicProvider,
  MusicStyle,
  MusicTasteProfile,
  PreferenceProfile,
  VenueType,
  Vibe
} from "@/lib/types";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

const cityOptions = ["Düsseldorf", "Köln", "Essen"];

export default function Home() {
  const [profile, setProfile] = useState<PreferenceProfile>(defaultProfile);
  const [city, setCity] = useState("Düsseldorf");
  const [locationStatus, setLocationStatus] = useState("Using sample nightlife data");
  const [isLocating, setIsLocating] = useState(false);
  const [musicTaste, setMusicTaste] = useState<MusicTasteProfile | null>(null);
  const recommendations = useMemo(() => getRecommendedVenues(venues, profile), [profile]);

  function toggleMusic(style: MusicStyle) {
    setProfile((current) => ({
      ...current,
      music: current.music.includes(style)
        ? current.music.filter((item) => item !== style)
        : [...current.music, style]
    }));
  }

  function requestLocation() {
    if (!("geolocation" in navigator)) {
      setLocationStatus("Location is not available in this browser. Choose your city manually.");
      return;
    }

    setIsLocating(true);
    setLocationStatus("Checking your location...");

    navigator.geolocation.getCurrentPosition(
      () => {
        setIsLocating(false);
        setCity("Düsseldorf");
        setLocationStatus("Location detected. Showing nearby MVP recommendations for Düsseldorf.");
      },
      () => {
        setIsLocating(false);
        setLocationStatus("Location was blocked. Choose your city manually to keep going.");
      },
      {
        enableHighAccuracy: true,
        timeout: 8000
      }
    );
  }

  function analyzeMusicTaste(provider: MusicProvider) {
    const taste = musicTasteProfiles[provider];
    setMusicTaste(taste);
    setProfile((current) => ({
      ...current,
      music: taste.topGenres,
      vibe: taste.energy
    }));
  }

  return (
    <main>
      <section className="mx-auto grid min-h-screen w-full max-w-7xl gap-8 px-4 py-5 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <div className="flex flex-col justify-between gap-8 rounded-lg border border-white/10 bg-black/24 p-5 sm:p-7">
          <div>
            <nav className="flex items-center justify-between">
              <div className="text-xl font-black tracking-normal">NITEFY</div>
              <div className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3 py-2 text-xs font-bold text-white/78">
                <MapPin size={14} className="text-cyan" />
                {city}
              </div>
            </nav>

            <div className="mt-14 max-w-xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-lime px-3 py-1 text-xs font-black text-night">
                <Sparkles size={14} />
                Don&apos;t guess the night. NITEFY it.
              </div>
              <h1 className="text-5xl font-black leading-[0.98] tracking-normal text-white sm:text-6xl">
                Find the place that actually fits your night.
              </h1>
              <p className="mt-5 text-lg leading-8 text-white/72">
                Connect your music taste or pick the vibe manually. NITEFY turns that into nightlife recommendations for tonight.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
              <LocateFixed size={18} className="text-cyan" />
              Location
            </div>
            <div className="flex flex-wrap gap-2">
              {cityOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
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
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-black text-night transition hover:bg-lime"
            >
              <Navigation size={16} />
              {isLocating ? "Checking..." : "Use my location"}
            </button>
            <p className="mt-3 text-sm leading-6 text-white/70">{locationStatus}</p>
          </div>
        </div>

        <div className="space-y-5">
          <section className="rounded-lg border border-lime/24 bg-lime/10 p-4 sm:p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-lime">Music taste scan</p>
                <h2 className="mt-1 text-2xl font-black text-white">Start with what you actually play.</h2>
              </div>
              <Sparkles className="shrink-0 text-lime" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {(["Spotify", "Apple Music"] as MusicProvider[]).map((provider) => (
                <button
                  key={provider}
                  type="button"
                  onClick={() => analyzeMusicTaste(provider)}
                  className={`rounded-lg border p-4 text-left transition ${
                    musicTaste?.provider === provider
                      ? "border-lime bg-lime text-night"
                      : "border-white/12 bg-night/55 text-white hover:border-lime/60"
                  }`}
                >
                  <span className="text-sm font-black">{provider}</span>
                  <span className={`mt-2 block text-sm leading-6 ${musicTaste?.provider === provider ? "text-night/72" : "text-white/64"}`}>
                    Demo analysis for MVP testing
                  </span>
                </button>
              ))}
            </div>

            {musicTaste ? (
              <div className="mt-4 rounded-lg border border-white/10 bg-night/55 p-4">
                <p className="text-sm font-black text-white">{musicTaste.provider} taste profile</p>
                <p className="mt-2 text-sm leading-6 text-white/72">{musicTaste.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {musicTaste.signals.map((signal) => (
                    <span key={signal} className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-bold text-white/78">
                      {signal}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-white/68">
                For the MVP this simulates Spotify or Apple Music. Real login comes after we validate that users want music-based recommendations.
              </p>
            )}
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.07] p-4 sm:p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-lime">Tune the profile</p>
                <h2 className="mt-1 text-2xl font-black text-white">Adjust your night.</h2>
              </div>
              <SlidersHorizontal className="text-cyan" />
            </div>

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
                  onClick={(value: Vibe) => setProfile((current) => ({ ...current, vibe: value }))}
                />
              ))}
            </PreferenceBlock>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="mb-5 sm:col-span-2">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <h3 className="text-sm font-black text-white/86">Distance</h3>
                  <span className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-black text-white/76">
                    Up to {profile.distanceKm} km
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  step="1"
                  value={profile.distanceKm}
                  onChange={(event) => setProfile((current) => ({ ...current, distanceKm: Number(event.target.value) }))}
                  className="h-2 w-full cursor-pointer accent-lime"
                  aria-label="Distance preference"
                />
              </div>

              <PreferenceBlock title="Budget">
                {budgetOptions.map((budget) => (
                  <OptionPill
                    key={budget}
                    label={budget}
                    active={profile.budget === budget}
                    onClick={(value: Budget) => setProfile((current) => ({ ...current, budget: value }))}
                  />
                ))}
              </PreferenceBlock>

              <PreferenceBlock title="Dress code">
                {dressCodeOptions.map((dressCode) => (
                  <OptionPill
                    key={dressCode}
                    label={dressCode}
                    active={profile.dressCode === dressCode}
                    onClick={(value: DressCode) => setProfile((current) => ({ ...current, dressCode: value }))}
                  />
                ))}
              </PreferenceBlock>

              <PreferenceBlock title="Place type">
                {venueTypeOptions.map((venueType) => (
                  <OptionPill
                    key={venueType}
                    label={venueType}
                    active={profile.venueType === venueType}
                    onClick={(value: VenueType | "Any") => setProfile((current) => ({ ...current, venueType: value }))}
                  />
                ))}
              </PreferenceBlock>

              <PreferenceBlock title="Tonight with">
                {contextOptions.map((context) => (
                  <OptionPill
                    key={context}
                    label={context}
                    active={profile.context === context}
                    onClick={(value: GroupContext) => setProfile((current) => ({ ...current, context: value }))}
                  />
                ))}
              </PreferenceBlock>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-lime">Recommended now</p>
                <h2 className="mt-1 text-2xl font-black text-white">
                  {recommendations.length} places near {city}
                </h2>
              </div>
              <p className="text-right text-sm text-white/62">Sorted by match, rating and distance</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {recommendations.map((venue, index) => (
                <VenueCard key={venue.id} venue={venue} featured={index === 0} />
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function PreferenceBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="mb-3 text-sm font-black text-white/86">{title}</h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
