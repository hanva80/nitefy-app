import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const clientId = process.env.SOUNDCLOUD_CLIENT_ID;

  if (!clientId) {
    return NextResponse.redirect(new URL("/?soundcloud=missing_config", request.url));
  }

  const state = randomBytes(24).toString("hex");
  const codeVerifier = base64url(randomBytes(64));
  const codeChallenge = base64url(createHash("sha256").update(codeVerifier).digest());
  const redirectUri = getRedirectUri(request);
  const authorizeUrl = new URL("https://secure.soundcloud.com/authorize");

  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("code_challenge", codeChallenge);
  authorizeUrl.searchParams.set("code_challenge_method", "S256");
  authorizeUrl.searchParams.set("state", state);

  const cookieOptions = {
    httpOnly: true,
    maxAge: 60 * 10,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production"
  };

  cookies().set("nitefy_soundcloud_state", state, cookieOptions);
  cookies().set("nitefy_soundcloud_code_verifier", codeVerifier, cookieOptions);

  return NextResponse.redirect(authorizeUrl);
}

function getRedirectUri(request: Request) {
  if (process.env.SOUNDCLOUD_REDIRECT_URI) {
    return process.env.SOUNDCLOUD_REDIRECT_URI;
  }

  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

  return `${baseUrl}/api/soundcloud/callback`;
}

function base64url(value: Buffer) {
  return value.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
