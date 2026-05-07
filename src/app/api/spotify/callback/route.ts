import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type SpotifyTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("nitefy_spotify_state")?.value;

  if (!code || !state || !storedState || state !== storedState) {
    return redirectHome(request, "state_error");
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return redirectHome(request, "missing_config");
  }

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      redirect_uri: getRedirectUri(request)
    }),
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  });

  if (!tokenResponse.ok) {
    return redirectHome(request, "token_error");
  }

  const token = (await tokenResponse.json()) as SpotifyTokenResponse;
  const response = redirectHome(request, "connected");

  response.cookies.delete("nitefy_spotify_state");
  response.cookies.set("nitefy_spotify_access_token", token.access_token, {
    httpOnly: true,
    maxAge: token.expires_in,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

  if (token.refresh_token) {
    response.cookies.set("nitefy_spotify_refresh_token", token.refresh_token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });
  }

  return response;
}

function redirectHome(request: Request, status: string) {
  const url = new URL("/", request.url);
  url.searchParams.set("spotify", status);

  return NextResponse.redirect(url);
}

function getRedirectUri(request: Request) {
  if (process.env.SPOTIFY_REDIRECT_URI) {
    return process.env.SPOTIFY_REDIRECT_URI;
  }

  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

  return `${baseUrl}/api/spotify/callback`;
}
