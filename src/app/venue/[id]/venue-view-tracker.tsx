"use client";

import { captureEvent } from "@/lib/analytics";
import { useEffect } from "react";

type VenueViewTrackerProps = {
  venueId: string;
  venueName: string;
  matchScore: number;
  venueType: string;
  neighborhood: string;
  city: string;
};

export function VenueViewTracker({ venueId, venueName, matchScore, venueType, neighborhood, city }: VenueViewTrackerProps) {
  useEffect(() => {
    captureEvent("Venue Viewed", {
      venueId,
      venueName,
      matchScore,
      venueType,
      neighborhood,
      city,
    });
  }, [venueId, venueName, matchScore, venueType, neighborhood, city]);

  return null;
}
