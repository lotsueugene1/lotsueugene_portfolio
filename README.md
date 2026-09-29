# Eugene Lotsu Portfolio

Personal portfolio for Eugene Lotsu, a software engineer and AI/ML researcher studying Computer Science at William Jewell College.

The site highlights:

- Neural PDE research and reproducible scientific computing
- Production marketplace and agentic AI engineering at VECINTI
- CLIP detector robustness research recognized among the NSRI Top 100
- STRUCTOR, a repository-intelligence project built at HackMIT
- A configurable, sandboxed automation agent
- A live Spotify listening page with an animated music companion

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Create a production build with:

```bash
npm run build
```

## Spotify music page

The music page and floating companion display the same Spotify account activity. They show a playing or paused track, fall back to the most recently played track when there is no current track, and show a quiet empty state until an account is connected. API failures show an unavailable state rather than an old track labelled as live.

Drag the companion with a mouse or touch to reposition it. Its position is saved in the current browser and kept within the viewport. You can also focus it with Tab and move it with the arrow keys. Click, tap, or press Enter or Space to open its music panel. Escape, the close button, or clicking outside closes the panel.

To connect your account:

1. Create an app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard). Register the redirect URI used by your one-time authorization flow.
2. Follow Spotify's [Authorization Code flow](https://developer.spotify.com/documentation/web-api/tutorials/code-flow) using only `user-read-currently-playing` and `user-read-recently-played`. Authorize your own account, then exchange the returned code for a refresh token. This repository does not expose a public authorization callback.
3. Copy `.env.example` to `.env.local` and set `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_REFRESH_TOKEN`. Add these same variables to your hosting provider when deploying, then restart or redeploy.

Keep these credentials private. Do not prefix them with `NEXT_PUBLIC_` or commit `.env.local`. Access tokens are refreshed on the server; if access is revoked or the refresh token expires, authorize again and replace `SPOTIFY_REFRESH_TOKEN`.

The public endpoint returns only the track information used by the page, not tokens or device details. It shares in-flight requests, caches Spotify responses for 15 seconds, and respects rate-limit backoff. The page and companion share one polling timer, which skips requests while the browser tab is hidden. Visitors do not need to connect an account and cannot control your Spotify playback.

To feature a playlist, set `music.playlistUrl` in `src/resources/content.tsx` to your Spotify playlist URL, such as `https://open.spotify.com/playlist/YOUR_PLAYLIST_ID`. The page uses Spotify's [official embedded player](https://developer.spotify.com/documentation/embeds/tutorials/creating-an-embed), independently of the listening-status connection. Leave the value empty to omit the playlist. The embedded player handles playback for the visitor.

The page checks playlist availability through Spotify's public oEmbed endpoint. If Spotify returns 404, it shows a link and an unavailable message instead of a broken player. The result is cached for five minutes. Timeouts or temporary network errors leave the player enabled, because they do not establish that the playlist is unavailable.

## Content

- Personal information and resume content: `src/resources/content.tsx`
- Theme, routes, and metadata: `src/resources/once-ui.config.ts`
- Project case studies: `src/app/work/projects`

## Stack

Next.js, TypeScript, React, MDX, Sass, and [Once UI](https://once-ui.com).

## License and attribution

This portfolio is based on [Magic Portfolio](https://github.com/once-ui-system/magic-portfolio) by Once UI and retains the required attribution. See `LICENSE` for the repository license.
