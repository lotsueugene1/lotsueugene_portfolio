"use client";

import { NowPlaying } from "./NowPlaying";
import { useNowPlaying } from "./useNowPlaying";
import styles from "./MusicPage.module.scss";

export function getSpotifyEmbedUrl(url: string | undefined) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/^\/playlist\/([a-zA-Z0-9]+)\/?$/);
    if (parsed.hostname !== "open.spotify.com" || parsed.protocol !== "https:" || !match) {
      return null;
    }
    return `https://open.spotify.com/embed/playlist/${match[1]}?utm_source=generator&theme=0`;
  } catch {
    return null;
  }
}

export function MusicPageClient({
  playlistUrl,
  playlistAvailable = true,
}: {
  playlistUrl?: string;
  playlistAvailable?: boolean;
}) {
  const { data, loading } = useNowPlaying();
  const playlistEmbed = getSpotifyEmbedUrl(playlistUrl);

  return (
    <div className={styles.sections}>
      <section aria-labelledby="current-listens" className={styles.section}>
        <h2 id="current-listens">Current listens</h2>
        <NowPlaying data={data} loading={loading} />
      </section>
      <section aria-labelledby="music-playlists" className={styles.section}>
        <h2 id="music-playlists">Playlists</h2>
        {playlistEmbed ? (
          <>
            {playlistAvailable ? (
              <iframe
                className={styles.embed}
                src={playlistEmbed}
                title="Eugene's Spotify playlist"
                height={352}
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            ) : (
              <p className={styles.emptyPlaylist}>This playlist is currently unavailable.</p>
            )}
          </>
        ) : (
          <p className={styles.emptyPlaylist}>Playlists coming soon.</p>
        )}
      </section>
    </div>
  );
}
