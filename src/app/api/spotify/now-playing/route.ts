import { NextResponse } from "next/server";

import type { NowPlayingResponse, SpotifyTrack } from "@/components/music/types";

export const dynamic = "force-dynamic";

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const CURRENTLY_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing?additional_types=track,episode";
const RECENTLY_PLAYED_ENDPOINT = "https://api.spotify.com/v1/me/player/recently-played?limit=1";
const REQUEST_TIMEOUT_MS = 5000;
const CACHE_MS = 15000;

type Credentials = { clientId: string; clientSecret: string; refreshToken: string };
type SpotifyImage = { url?: string };
type SpotifyArtist = { name?: string };

type SpotifyItem = {
  type?: string;
  name?: string;
  duration_ms?: number;
  external_urls?: { spotify?: string };
  artists?: SpotifyArtist[];
  album?: { name?: string; images?: SpotifyImage[] };
  images?: SpotifyImage[];
  show?: { name?: string };
};

type PlaybackPayload = {
  is_playing?: boolean;
  progress_ms?: number | null;
  device?: { is_private_session?: boolean };
  item?: SpotifyItem | null;
};

type RecentlyPlayedPayload = {
  items?: Array<{ played_at?: string; track?: SpotifyItem }>;
};

let tokenCache: { accessToken: string; expiresAt: number } | null = null;
let tokenRequest: Promise<string> | null = null;
let resultCache: { data: NowPlayingResponse; expiresAt: number } | null = null;
let resultRequest: Promise<NowPlayingResponse> | null = null;

class SpotifyRequestError extends Error {
  constructor(public retryAfterMs = 30000) {
    super("Spotify activity is unavailable");
  }
}

function dataResponse(data: Omit<NowPlayingResponse, "checkedAt">): NowPlayingResponse {
  return { ...data, checkedAt: new Date().toISOString() };
}

function normalizeTrack(
  item: SpotifyItem | null | undefined,
  progressMs = 0,
  playedAt: string | null = null,
): SpotifyTrack | null {
  if (!item?.name || (item.type && item.type !== "track" && item.type !== "episode")) {
    return null;
  }

  const isEpisode = item.type === "episode";
  const images = isEpisode ? item.images : item.album?.images;
  const durationMs = Math.max(0, item.duration_ms ?? 0);

  return {
    title: item.name,
    artist: isEpisode
      ? item.show?.name || "Podcast"
      : item.artists
          ?.map((artist) => artist.name)
          .filter(Boolean)
          .join(", ") || "Unknown artist",
    album: isEpisode ? item.show?.name || "Podcast" : item.album?.name || "Unknown album",
    albumImage: images?.find((image) => image.url)?.url ?? null,
    spotifyUrl: item.external_urls?.spotify ?? null,
    durationMs,
    progressMs: Math.max(0, Math.min(progressMs, durationMs)),
    playedAt,
    type: isEpisode ? "episode" : "track",
  };
}

function checkResponse(response: Response) {
  if (response.ok) return;
  const retryAfter = Number(response.headers.get("Retry-After"));
  throw new SpotifyRequestError(
    response.status === 429 && retryAfter > 0 ? retryAfter * 1000 : 30000,
  );
}

async function getAccessToken({ clientId, clientSecret, refreshToken }: Credentials) {
  if (tokenCache && tokenCache.expiresAt > Date.now()) return tokenCache.accessToken;
  if (tokenRequest) return tokenRequest;

  tokenRequest = (async () => {
    const authorization = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authorization}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    checkResponse(response);
    const token = (await response.json()) as { access_token?: string; expires_in?: number };
    if (!token.access_token) throw new SpotifyRequestError();

    tokenCache = {
      accessToken: token.access_token,
      expiresAt: Date.now() + Math.max(0, (token.expires_in ?? 3600) - 60) * 1000,
    };
    return token.access_token;
  })();

  try {
    return await tokenRequest;
  } finally {
    tokenRequest = null;
  }
}

async function spotifyFetch(url: string, credentials: Credentials): Promise<Response> {
  const request = async () => {
    const accessToken = await getAccessToken(credentials);
    return fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  };

  let response = await request();
  if (response.status === 401) {
    tokenCache = null;
    response = await request();
  }
  checkResponse(response);
  return response;
}

async function loadActivity(credentials: Credentials): Promise<NowPlayingResponse> {
  const currentResponse = await spotifyFetch(CURRENTLY_PLAYING_ENDPOINT, credentials);

  if (currentResponse.status !== 204) {
    const current = (await currentResponse.json()) as PlaybackPayload;
    if (current.device?.is_private_session) {
      return dataResponse({ configured: true, status: "idle", track: null });
    }
    const track = normalizeTrack(current.item, current.progress_ms ?? 0);
    if (track) {
      return dataResponse({
        configured: true,
        status: current.is_playing ? "playing" : "paused",
        track,
      });
    }
  }

  const recentResponse = await spotifyFetch(RECENTLY_PLAYED_ENDPOINT, credentials);
  if (recentResponse.status !== 204) {
    const recent = (await recentResponse.json()) as RecentlyPlayedPayload;
    const latest = recent.items?.[0];
    const track = normalizeTrack(latest?.track, 0, latest?.played_at ?? null);
    if (track) return dataResponse({ configured: true, status: "last-played", track });
  }

  return dataResponse({ configured: true, status: "idle", track: null });
}

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return NextResponse.json(dataResponse({ configured: false, status: "idle", track: null }), {
      headers: { "Cache-Control": "no-store" },
    });
  }

  if (!resultCache || resultCache.expiresAt <= Date.now()) {
    if (!resultRequest) {
      resultRequest = (async () => {
        let data: NowPlayingResponse;
        let cacheMs = CACHE_MS;
        try {
          data = await loadActivity({ clientId, clientSecret, refreshToken });
        } catch (error) {
          // Do not leave a stale track labelled as currently playing after an API failure.
          data = dataResponse({ configured: true, status: "unavailable", track: null });
          cacheMs = error instanceof SpotifyRequestError ? error.retryAfterMs : 30000;
        }
        resultCache = { data, expiresAt: Date.now() + cacheMs };
        return data;
      })();
    }

    try {
      await resultRequest;
    } finally {
      resultRequest = null;
    }
  }

  return NextResponse.json(resultCache!.data, {
    headers: { "Cache-Control": "public, max-age=0, s-maxage=15" },
  });
}
