export type SpotifyTrack = {
  title: string;
  artist: string;
  album: string;
  albumImage: string | null;
  spotifyUrl: string | null;
  durationMs: number;
  progressMs: number;
  playedAt: string | null;
  type: "track" | "episode";
};

export type NowPlayingResponse = {
  configured: boolean;
  status: "playing" | "paused" | "last-played" | "idle" | "unavailable";
  track: SpotifyTrack | null;
  checkedAt: string;
};
