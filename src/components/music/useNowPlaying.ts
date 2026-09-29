"use client";

import { useSyncExternalStore } from "react";

import type { NowPlayingResponse } from "./types";

const emptyState: NowPlayingResponse = {
  configured: true,
  status: "idle",
  track: null,
  checkedAt: new Date(0).toISOString(),
};

const initialSnapshot = { data: emptyState, loading: true };
let snapshot = initialSnapshot;
let inFlight: Promise<void> | null = null;
let lastRequestAt = 0;
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

async function refresh() {
  if (inFlight) return inFlight;
  if (Date.now() - lastRequestAt < 5000) return;

  lastRequestAt = Date.now();
  inFlight = (async () => {
    try {
      const response = await fetch("/api/spotify/now-playing", {
        cache: "no-store",
        signal: AbortSignal.timeout(20000),
      });

      if (!response.ok) throw new Error("Unable to load Spotify activity");

      const data = (await response.json()) as NowPlayingResponse;
      snapshot = { data, loading: false };
    } catch {
      snapshot = {
        data: {
          ...emptyState,
          configured: snapshot.data.configured,
          status: "unavailable",
          checkedAt: new Date().toISOString(),
        },
        loading: false,
      };
    } finally {
      inFlight = null;
      for (const listener of listeners) listener();
    }
  })();

  return inFlight;
}

function refreshWhenVisible() {
  if (document.visibilityState === "visible") void refresh();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // The page and floating companion share one request and polling timer.
  if (listeners.size === 1) {
    refreshWhenVisible();
    timer = setInterval(refreshWhenVisible, 20000);
    document.addEventListener("visibilitychange", refreshWhenVisible);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      if (timer) clearInterval(timer);
      timer = null;
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    }
  };
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return initialSnapshot;
}

export function useNowPlaying() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { ...state, refresh };
}

export function formatPlaybackTime(milliseconds: number) {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}
