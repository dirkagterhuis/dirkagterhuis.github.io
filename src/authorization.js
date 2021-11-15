// import { clientId } from './secrets'
// import { Express } from 'express'

// const spotifyClientId = process.env.SPOTIFY_APP_CLIENT_ID
//     ? process.env.SPOTIFY_CLIENT_ID
//     : localSpotifyAppClientId
const spotifyClientId = 'dd79131036984f2a9bed15ced3265646'
const state = '555666777' // generateRandomString(16) // TO DO: make this random, e.g. https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
const scope = 'playlist-read-private'
const redirect_uri = 'http://localhost:8000/views/spotify-app.html'

// var app = express()

// function startAuth() {
//     app.get('/login', function (req, res) {
//         res.redirect(
//             'https://accounts.spotify.com/authorize?' +
//                 querystring.stringify({
//                     response_type: 'code',
//                     client_id: spotifyClientId,
//                     scope: scope,
//                     redirect_uri: redirect_uri,
//                     state: state,
//                 })
//         )
//     })
// }

async function startAuthFromClient() {
    // prettier-ignore
    const url =
        'https://accounts.spotify.com/authorize?' +
            'client_id=' + spotifyClientId + '&' +
            'response_type=code&' +
            'scope=' + scope + '&' +
            'redirect_uri=' + redirect_uri + '&' +
            'state=' + state + '&' + 
            'code_challenge_method=S256' + '&' +
            'code_challenge= + ' + codeChallenge
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // or http://localhost:8000 or http://localhost:8000/views/spotify-app.html
        },
    })
    const result = await response.json() //extract JSON from the http response
    console.log(result)
}

function sha256(plain) {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)

    return window.crypto.subtle.digest('SHA-256', data)
}

function base64urlencode(a) {
    return b2a(
        String.fromCharCode
            .apply(null, new Uint8Array(a))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '')
    )
}

const hashed = sha256(makeid(64))
const codeChallenge = base64urlencode(hashed)

// prettier-ignore
function b2a(a) {
    var c, d, e, f, g, h, i, j, o, b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", k = 0, l = 0, m = "", n = [];
    if (!a) return a;
    do c = a.charCodeAt(k++), d = a.charCodeAt(k++), e = a.charCodeAt(k++), j = c << 16 | d << 8 | e, 
    f = 63 & j >> 18, g = 63 & j >> 12, h = 63 & j >> 6, i = 63 & j, n[l++] = b.charAt(f) + b.charAt(g) + b.charAt(h) + b.charAt(i); while (k < a.length);
    return m = n.join(""), o = a.length % 3, (o ? m.slice(0, o - 3) :m) + "===".slice(o || 3);
}

function makeid(length) {
    var result = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}
