"use client";

import { useEffect, useState } from "react";
import { FiArrowUpRight, FiHeadphones } from "react-icons/fi";
import { FaSpotify } from "react-icons/fa6";
import type { NowPlayingResponse } from "./types";
import { formatPlaybackTime } from "./useNowPlaying";
import styles from "./NowPlaying.module.scss";

export function Equalizer() {
  return (
    <span className={styles.equalizer} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

export function NowPlaying({
  data,
  loading = false,
  compact = false,
}: {
  data: NowPlayingResponse;
  loading?: boolean;
  compact?: boolean;
}) {
  const [elapsed, setElapsed] = useState(0);
  const { track, status } = data;
  const playing = status === "playing";

  useEffect(() => {
    if (!playing) {
      setElapsed(0);
      return;
    }
    const checkedAt = Date.parse(data.checkedAt);
    const started = Number.isFinite(checkedAt) ? checkedAt : Date.now();
    const update = () => setElapsed(Math.max(0, Date.now() - started));
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [playing, data.checkedAt]);

  if (!track || loading) {
    return (
      <div className={styles.empty} role="status">
        <span className={styles.placeholder}>
          <FiHeadphones size={22} aria-hidden="true" />
        </span>
        <div>
          <span className={styles.label}>Spotify</span>
          <p>
            {loading
              ? "Checking what's playing…"
              : status === "unavailable"
                ? "Listening activity is unavailable."
                : !data.configured
                  ? "Listening activity coming soon."
                  : "Nothing playing right now."}
          </p>
        </div>
      </div>
    );
  }

  const progress = Math.min(track.durationMs, track.progressMs + elapsed);
  const label = playing ? "Currently playing" : status === "paused" ? "Paused" : "Last played";
  const contents = (
    <>
      <div className={styles.row}>
        {track.albumImage ? (
          <img
            className={styles.cover}
            src={track.albumImage}
            alt={`${track.album} cover`}
            width={56}
            height={56}
          />
        ) : (
          <span className={styles.placeholder}>
            <FiHeadphones size={22} aria-hidden="true" />
          </span>
        )}
        <div className={styles.details}>
          <span className={`${styles.label} ${playing ? styles.playingLabel : ""}`}>{label}</span>
          <span className={styles.title}>{track.title}</span>
          <span className={styles.artist}>{track.artist}</span>
        </div>
        {playing ? (
          <Equalizer />
        ) : track.spotifyUrl ? (
          <FiArrowUpRight className={styles.arrow} aria-hidden="true" />
        ) : null}
      </div>
      {playing && track.durationMs > 0 && (
        <div
          className={styles.progress}
          role="progressbar"
          aria-label="Song progress"
          aria-valuemin={0}
          aria-valuemax={track.durationMs}
          aria-valuenow={progress}
          aria-valuetext={`${formatPlaybackTime(progress)} of ${formatPlaybackTime(track.durationMs)}`}
        >
          <span style={{ width: `${(progress / track.durationMs) * 100}%` }} />
        </div>
      )}
    </>
  );

  return (
    <div className={compact ? styles.compact : undefined}>
      {track.spotifyUrl ? (
        <a
          className={styles.track}
          href={track.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label}: ${track.title} by ${track.artist}. Open in Spotify`}
        >
          {contents}
        </a>
      ) : (
        <div className={styles.track}>{contents}</div>
      )}
      {!compact && (
        <span className={styles.source}>
          <FaSpotify aria-hidden="true" /> Spotify
        </span>
      )}
    </div>
  );
}
