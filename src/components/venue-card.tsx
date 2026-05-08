"use client";

import { ArrowRight, Clock, MapPin, Shirt, Star, Ticket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { captureEvent } from "@/lib/analytics";
import type { VenueMatch } from "@/lib/types";

type VenueCardProps = {
  venue: VenueMatch;
  featured?: boolean;
};

export function VenueCard({ venue, featured = false }: VenueCardProps) {
  return (
    <article className={`overflow-hidden rounded-lg border border-white/12 bg-[#10131b]/92 shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition hover:border-lime/40 ${featured ? "xl:col-span-2" : ""}`}>
      <div className={`relative ${featured ? "min-h-[340px]" : "min-h-[250px]"}`}>
        <Image
          src={venue.image}
          alt={`${venue.name} atmosphere`}
          fill
          sizes={featured ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/42 to-black/16" />
        <div className="absolute left-4 top-4 rounded-lg bg-lime px-3 py-2 text-xs font-black text-night shadow-glow">{venue.matchScore}% match</div>
        <div className="absolute right-4 top-4 rounded-lg border border-white/14 bg-black/46 px-3 py-2 text-xs font-black text-white backdrop-blur">
          {venue.priceLabel}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase text-white/75">
            <span>{venue.type}</span>
            <span className="text-lime">/</span>
            <span>{venue.neighborhood}</span>
          </div>
          <h3 className="mt-1 text-3xl font-black leading-tight text-white">{venue.name}</h3>
          <p className="mt-2 max-w-xl text-sm font-semibold text-white/82">{venue.visualCue}</p>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-3 text-sm text-white/82 sm:grid-cols-4">
          <span className="flex items-center gap-2 rounded-lg bg-black/24 px-3 py-2">
            <MapPin size={16} className="text-cyan" />
            {venue.distanceKm.toFixed(1)} km
          </span>
          <span className="flex items-center gap-2 rounded-lg bg-black/24 px-3 py-2">
            <Ticket size={16} className="text-cyan" />
            {venue.priceLabel}
          </span>
          <span className="flex items-center gap-2 rounded-lg bg-black/24 px-3 py-2">
            <Shirt size={16} className="text-cyan" />
            {venue.dressCode}
          </span>
          <span className="flex items-center gap-2 rounded-lg bg-black/24 px-3 py-2">
            <Star size={16} className="fill-lime text-lime" />
            {venue.rating.toFixed(1)}
          </span>
        </div>

        {featured ? <p className="text-sm leading-6 text-white/76">{venue.description}</p> : null}

        <div className="flex flex-wrap gap-2">
          {venue.music.map((style) => (
            <span key={style} className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-semibold text-white/80">
              {style}
            </span>
          ))}
        </div>

        <div className="border-t border-white/10 pt-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase text-lime">
            <Clock size={14} />
            {venue.openingHours}
          </div>
          <p className="text-sm font-black text-white">Why it fits tonight</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {venue.matchReasons.map((reason) => (
              <span key={reason} className="rounded-full bg-lime/10 px-3 py-1 text-xs font-bold text-lime">
                {reason}
              </span>
            ))}
          </div>
        </div>

        <Link
          href={`/venue/${venue.id}`}
          onClick={() =>
            captureEvent("Venue Opened", {
              venueId: venue.id,
              venueName: venue.name,
              matchScore: venue.matchScore,
              type: venue.type
            })
          }
          className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-center text-sm font-black text-night transition hover:bg-lime"
        >
          View venue
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
