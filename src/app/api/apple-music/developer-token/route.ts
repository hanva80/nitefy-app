import { createAppleMusicDeveloperToken } from "@/lib/apple-music";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const developerToken = createAppleMusicDeveloperToken();

  if (!developerToken) {
    return NextResponse.json(
      {
        error: "apple_music_missing_config",
        hint: "Apple Music needs APPLE_MUSIC_TEAM_ID, APPLE_MUSIC_KEY_ID and APPLE_MUSIC_PRIVATE_KEY in Vercel."
      },
      {
        status: 501
      }
    );
  }

  return NextResponse.json(
    {
      developerToken
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
