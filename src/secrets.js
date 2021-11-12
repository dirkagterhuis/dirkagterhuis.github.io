import { localSpotifyAppClientId, localSpotifyAppClientSecret } from '../local.json'

export const spotifyClientId = process.env.SPOTIFY_APP_CLIENT_ID
    ? process.env.SPOTIFY_CLIENT_ID
    : localSpotifyAppClientId
export const spotifyClientSecret = process.env.SPOTIFY_APP_CLIENT_SECRET
    ? process.env.SPOTIFY_APP_CLIENT_SECRET
    : localSpotifyAppClientSecret
