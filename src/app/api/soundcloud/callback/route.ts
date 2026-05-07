import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type SoundCloudTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = cookies();
  const storedState = cookieStore.get("nitefy_soundcloud_state")?.value;
  const codeVerifier = cookieStore.get("nitefy_soundcloud_code_verifier")?.value;

  if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
    return redirectHome(request, "state_error");
  }

  const clientId = process.env.SOUNDCLOUD_CLIENT_ID;
  const clientSecret = process.env.SOUNDCLOUD_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return redirectHome(request, "missing_config");
  }

  const tokenResponse = await fetch("https://secure.soundcloud.com/oauth/token", {
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      code_verifier: codeVerifier,
      grant_type: "authorization_code",
      redirect_uri: getRedirectUri(request)
    }),
    cache: "no-store",
    headers: {
      Accept: "application/json; charset=utf-8",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  });

  if (!tokenResponse.ok) {
    return redirectHome(request, "token_error");
  }

  const token = (await tokenResponse.json()) as SoundCloudTokenResponse;
  const response = redirectHome(request, "connected");

  response.cookies.delete("nitefy_soundcloud_state");
  response.cookies.delete("nitefy_soundcloud_code_verifier");
  response.cookies.set("nitefy_soundcloud_access_token", token.access_token, {
    httpOnly: true,
    maxAge: token.expires_in ?? 60 * 60,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

  if (token.refresh_token) {
    response.cookies.set("nitefy_soundcloud_refresh_token", token.refresh_token, {
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
  url.searchParams.set("soundcloud", status);

  return NextResponse.redirect(url);
}

function getRedirectUri(request: Request) {
  if (process.env.SOUNDCLOUD_REDIRECT_URI) {
    return process.env.SOUNDCLOUD_REDIRECT_URI;
  }

  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

  return `${baseUrl}/api/soundcloud/callback`;
}
