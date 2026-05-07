import { buildSpotifyTasteProfile, type SpotifyArtist, type SpotifyTrack } from "@/lib/spotify";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type SpotifyTopItemsResponse<T> = {
  items: T[];
};

export async function GET() {
  const accessToken = cookies().get("nitefy_spotify_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      {
        error: "spotify_not_connected"
      },
      {
        status: 401
      }
    );
  }

  const [artistsResponse, tracksResponse] = await Promise.all([
    fetchSpotify<SpotifyTopItemsResponse<SpotifyArtist>>(
      "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10",
      accessToken
    ),
    fetchSpotify<SpotifyTopItemsResponse<SpotifyTrack>>(
      "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10",
      accessToken
    )
  ]);

  if (!artistsResponse.ok || !tracksResponse.ok) {
    return NextResponse.json(
      {
        error: "spotify_profile_unavailable"
      },
      {
        status: artistsResponse.status || tracksResponse.status || 502
      }
    );
  }

  return NextResponse.json({
    profile: buildSpotifyTasteProfile(artistsResponse.data.items, tracksResponse.data.items)
  });
}

async function fetchSpotify<T>(url: string, accessToken: string): Promise<{ data: T; ok: true; status: number } | { ok: false; status: number }> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    return {
      ok: false,
      status: response.status
    };
  }

  return {
    data: (await response.json()) as T,
    ok: true,
    status: response.status
  };
}
