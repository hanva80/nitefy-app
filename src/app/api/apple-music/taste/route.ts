import { buildAppleMusicTasteProfile, createAppleMusicDeveloperToken, type AppleMusicTrack } from "@/lib/apple-music";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type AppleMusicRecentlyPlayedResponse = {
  data?: AppleMusicTrack[];
};

export async function POST(request: Request) {
  const developerToken = createAppleMusicDeveloperToken();

  if (!developerToken) {
    return musicError("apple_music_missing_config", "Apple Music is not configured yet.", 501);
  }

  const body = (await request.json().catch(() => null)) as { musicUserToken?: string } | null;
  const musicUserToken = body?.musicUserToken;

  if (!musicUserToken) {
    return musicError("apple_music_not_connected", "Connect Apple Music again to scan your taste.", 401);
  }

  const response = await fetch("https://api.music.apple.com/v1/me/recent/played/tracks?types=songs,library-songs&limit=30", {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${developerToken}`,
      "Music-User-Token": musicUserToken
    }
  });

  if (!response.ok) {
    return musicError("apple_music_profile_unavailable", getAppleMusicHint(response.status), response.status);
  }

  const data = (await response.json()) as AppleMusicRecentlyPlayedResponse;

  return NextResponse.json({
    profile: buildAppleMusicTasteProfile(data.data ?? [])
  });
}

function musicError(error: string, hint: string, status: number) {
  return NextResponse.json(
    {
      error,
      hint,
      status
    },
    {
      status
    }
  );
}

function getAppleMusicHint(status: number) {
  if (status === 401 || status === 403) {
    return "Apple Music authorization failed. Make sure the account is allowed and the MusicKit key is valid.";
  }

  if (status === 429) {
    return "Apple Music is rate limiting requests right now. Wait a moment and try again.";
  }

  return "Apple Music connected, but your taste profile could not be loaded.";
}
