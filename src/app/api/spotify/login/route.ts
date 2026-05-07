import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const scope = "user-top-read";

export async function GET(request: Request) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;

  if (!clientId) {
    return NextResponse.redirect(new URL("/?spotify=missing_config", request.url));
  }

  const state = crypto.randomUUID();
  const redirectUri = getRedirectUri(request);
  const authorizeUrl = new URL("https://accounts.spotify.com/authorize");

  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("scope", scope);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("state", state);

  cookies().set("nitefy_spotify_state", state, {
    httpOnly: true,
    maxAge: 60 * 10,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

  return NextResponse.redirect(authorizeUrl);
}

function getRedirectUri(request: Request) {
  if (process.env.SPOTIFY_REDIRECT_URI) {
    return process.env.SPOTIFY_REDIRECT_URI;
  }

  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

  return `${baseUrl}/api/spotify/callback`;
}
