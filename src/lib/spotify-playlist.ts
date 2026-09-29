const CACHE_MS = 5 * 60 * 1000;

const availabilityCache = new Map<string, { available: boolean; expiresAt: number }>();
const requests = new Map<string, Promise<boolean>>();

/** False means missing, invalid, or explicitly unavailable. Network failures remain unknown/true. */
export async function getPlaylistAvailability(playlistUrl?: string): Promise<boolean> {
  if (!playlistUrl) return false;

  let canonicalUrl: string;
  try {
    const url = new URL(playlistUrl);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "open.spotify.com" ||
      !/^\/playlist\/[A-Za-z0-9]{22}\/?$/.test(url.pathname)
    ) {
      return false;
    }
    canonicalUrl = `https://open.spotify.com${url.pathname.replace(/\/$/, "")}`;
  } catch {
    return false;
  }

  const cached = availabilityCache.get(canonicalUrl);
  if (cached && cached.expiresAt > Date.now()) return cached.available;

  const existingRequest = requests.get(canonicalUrl);
  if (existingRequest) return existingRequest;

  const request = (async () => {
    let available = true;
    try {
      const response = await fetch(
        `https://open.spotify.com/oembed?url=${encodeURIComponent(canonicalUrl)}`,
        { cache: "no-store", signal: AbortSignal.timeout(5000) },
      );
      // A 404 confirms an unavailable playlist. Other failures are inconclusive.
      available = response.status !== 404;
    } catch {
      // Keep the player usable if only the server's network check failed.
    }
    availabilityCache.set(canonicalUrl, { available, expiresAt: Date.now() + CACHE_MS });
    return available;
  })();

  requests.set(canonicalUrl, request);
  try {
    return await request;
  } finally {
    requests.delete(canonicalUrl);
  }
}
