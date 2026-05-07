import { buildSpotifyTasteProfile, type SpotifyArtist, type SpotifyTrack } from "@/lib/spotify";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type SpotifyTopItemsResponse<T> = {
  items: T[];
};

type SpotifyTokenResponse = {
  access_token: string;
  expires_in: number;
};

export async function GET() {
  const cookieStore = cookies();
  let accessToken = cookieStore.get("nitefy_spotify_access_token")?.value;
  const refreshToken = cookieStore.get("nitefy_spotify_refresh_token")?.value;
  let refreshedToken: SpotifyTokenResponse | null = null;

  if (!accessToken) {
    refreshedToken = await refreshAccessToken(refreshToken);
    accessToken = refreshedToken?.access_token;

    if (!accessToken) {
      return spotifyError("spotify_not_connected", "Connect Spotify again to scan your music taste.", 401);
    }
  }

  let [artistsResponse, tracksResponse] = await fetchTasteSignals(accessToken);

  if ((artistsResponse.status === 401 || tracksResponse.status === 401) && refreshToken) {
    refreshedToken = await refreshAccessToken(refreshToken);

    if (refreshedToken?.access_token) {
      accessToken = refreshedToken.access_token;
      [artistsResponse, tracksResponse] = await fetchTasteSignals(accessToken);
    }
  }

  if (!artistsResponse.ok || !tracksResponse.ok) {
    const status = artistsResponse.status || tracksResponse.status || 502;

    return spotifyError("spotify_profile_unavailable", getSpotifyHint(status), status);
  }

  let profile;

  try {
    profile = buildSpotifyTasteProfile(artistsResponse.data.items ?? [], tracksResponse.data.items ?? []);
  } catch {
    return spotifyError("spotify_profile_parse_error", "Spotify connected, but the music data came back in an unexpected format. Try reconnecting Spotify.", 502);
  }

  const response = NextResponse.json({
    profile
  });

  if (refreshedToken) {
    response.cookies.set("nitefy_spotify_access_token", refreshedToken.access_token, {
      httpOnly: true,
      maxAge: refreshedToken.expires_in,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });
  }

  return response;
}

function fetchTasteSignals(accessToken: string) {
  return Promise.all([
    fetchSpotify<SpotifyTopItemsResponse<SpotifyArtist>>(
      "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10",
      accessToken
    ),
    fetchSpotify<SpotifyTopItemsResponse<SpotifyTrack>>(
      "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10",
      accessToken
    )
  ]);
}

async function fetchSpotify<T>(url: string, accessToken: string): Promise<{ data: T; ok: true; status: number } | { ok: false; status: number }> {
  const response = await fetch(url, {
    cache: "no-store",
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

async function refreshAccessToken(refreshToken?: string) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!refreshToken || !clientId || !clientSecret) {
    return null;
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken
    }),
    cache: "no-store",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as SpotifyTokenResponse;
}

function spotifyError(error: string, hint: string, status: number) {
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

function getSpotifyHint(status: number) {
  if (status === 401) {
    return "Your Spotify session expired. Connect Spotify again.";
  }

  if (status === 403) {
    return "Spotify blocked access to top items. If the app is in development mode, add this Spotify account as a test user in the Spotify Developer Dashboard.";
  }

  if (status === 429) {
    return "Spotify is rate limiting requests right now. Wait a moment and try again.";
  }

  return "Spotify connected, but your taste profile could not be loaded. Try reconnecting Spotify.";
}
