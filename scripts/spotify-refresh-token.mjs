// One-off helper: gets a Spotify refresh token for the "now playing" widget.
//
// 1. Create an app at https://developer.spotify.com/dashboard
//    Redirect URI: http://127.0.0.1:8888/callback  (Spotify requires the loopback IP, not "localhost")
// 2. Put SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local
// 3. Run: node --env-file=.env.local scripts/spotify-refresh-token.mjs
// 4. Open the printed URL, approve, and copy SPOTIFY_REFRESH_TOKEN into .env.local and Vercel.

import { randomBytes } from "node:crypto";
import { createServer } from "node:http";

const { SPOTIFY_CLIENT_ID: clientId, SPOTIFY_CLIENT_SECRET: clientSecret } = process.env;
if (!clientId || !clientSecret) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET (e.g. in .env.local) first.");
  process.exit(1);
}

const port = 8888;
const redirectUri = `http://127.0.0.1:${port}/callback`;
const state = randomBytes(16).toString("hex");
const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
authorizeUrl.search = new URLSearchParams({
  client_id: clientId,
  response_type: "code",
  redirect_uri: redirectUri,
  scope: "user-read-currently-playing user-read-recently-played",
  state,
}).toString();

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", redirectUri);
  if (url.pathname !== "/callback") return res.writeHead(404).end();

  if (url.searchParams.get("state") !== state) {
    res.writeHead(400).end("State mismatch. Start again.");
    return server.close();
  }
  const code = url.searchParams.get("code");
  if (!code) {
    res.writeHead(400).end(`Authorization failed: ${url.searchParams.get("error")}`);
    return server.close();
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });
  const body = await response.json();

  if (!response.ok || !body.refresh_token) {
    console.error("Token exchange failed:", body);
    res.writeHead(500).end("Token exchange failed. See the terminal.");
  } else {
    console.info(`\nSPOTIFY_REFRESH_TOKEN=${body.refresh_token}\n`);
    res
      .writeHead(200, { "Content-Type": "text/plain; charset=utf-8" })
      .end("Done. Check the terminal.");
  }
  server.close();
});

server.listen(port, "127.0.0.1", () => {
  console.info(`Open this URL and approve access:\n\n${authorizeUrl}\n`);
});
