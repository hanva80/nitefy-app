import { buildSoundCloudTasteProfile, type SoundCloudTrack } from "@/lib/soundcloud";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type SoundCloudLikedTracksResponse = {
  collection?: SoundCloudTrack[];
};

type SoundCloudTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
};

export async function GET() {
  const cookieStore = cookies();
  let accessToken = cookieStore.get("nitefy_soundcloud_access_token")?.value;
  let refreshToken = cookieStore.get("nitefy_soundcloud_refresh_token")?.value;
  let refreshedToken: SoundCloudTokenResponse | null = null;

  if (!accessToken) {
    refreshedToken = await refreshAccessToken(refreshToken);
    accessToken = refreshedToken?.access_token;
    refreshToken = refreshedToken?.refresh_token ?? refreshToken;

    if (!accessToken) {
      return soundCloudError("soundcloud_not_connected", "Connect SoundCloud again to scan your likes.", 401);
    }
  }

  let likedTracksResponse = await fetchSoundCloud<SoundCloudTrack[] | SoundCloudLikedTracksResponse>(
    "https://api.soundcloud.com/me/likes/tracks?limit=25&linked_partitioning=true",
    accessToken
  );

  if (likedTracksResponse.status === 401 && refreshToken) {
    refreshedToken = await refreshAccessToken(refreshToken);

    if (refreshedToken?.access_token) {
      accessToken = refreshedToken.access_token;
      likedTracksResponse = await fetchSoundCloud<SoundCloudTrack[] | SoundCloudLikedTracksResponse>(
        "https://api.soundcloud.com/me/likes/tracks?limit=25&linked_partitioning=true",
        accessToken
      );
    }
  }

  if (!likedTracksResponse.ok) {
    return soundCloudError("soundcloud_profile_unavailable", getSoundCloudHint(likedTracksResponse.status), likedTracksResponse.status || 502);
  }

  const tracks = Array.isArray(likedTracksResponse.data) ? likedTracksResponse.data : likedTracksResponse.data.collection ?? [];
  const response = NextResponse.json({
    profile: buildSoundCloudTasteProfile(tracks)
  });

  if (refreshedToken) {
    response.cookies.set("nitefy_soundcloud_access_token", refreshedToken.access_token, {
      httpOnly: true,
      maxAge: refreshedToken.expires_in ?? 60 * 60,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });

    if (refreshedToken.refresh_token) {
      response.cookies.set("nitefy_soundcloud_refresh_token", refreshedToken.refresh_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
      });
    }
  }

  return response;
}

async function fetchSoundCloud<T>(url: string, accessToken: string): Promise<{ data: T; ok: true; status: number } | { ok: false; status: number }> {
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json; charset=utf-8",
      Authorization: `OAuth ${accessToken}`
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
  const clientId = process.env.SOUNDCLOUD_CLIENT_ID;
  const clientSecret = process.env.SOUNDCLOUD_CLIENT_SECRET;

  if (!refreshToken || !clientId || !clientSecret) {
    return null;
  }

  const response = await fetch("https://secure.soundcloud.com/oauth/token", {
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken
    }),
    cache: "no-store",
    headers: {
      Accept: "application/json; charset=utf-8",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as SoundCloudTokenResponse;
}

function soundCloudError(error: string, hint: string, status: number) {
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

function getSoundCloudHint(status: number) {
  if (status === 401) {
    return "Your SoundCloud session expired. Connect SoundCloud again.";
  }

  if (status === 403) {
    return "SoundCloud blocked access to liked tracks for this account or app.";
  }

  if (status === 429) {
    return "SoundCloud is rate limiting requests right now. Wait a moment and try again.";
  }

  return "SoundCloud connected, but your liked tracks could not be loaded.";
}
