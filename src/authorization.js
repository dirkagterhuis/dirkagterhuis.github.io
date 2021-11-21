import { config } from '../config'
import { Express } from 'express'

const state = generateRandomString(16)
const scope = 'playlist-read-private'
const redirect_uri = 'http://localhost:8000/views/spotify-app.html' //TODO: make this dependent on environment

var app = express()

function startAuth() {
    app.get('/login', function (req, res) {
        res.redirect(
            'https://accounts.spotify.com/authorize?' +
                querystring.stringify({
                    response_type: 'code',
                    client_id: config.spotifyClientId,
                    scope: scope,
                    redirect_uri: redirect_uri,
                    state: state,
                    code_challenge_method: 'S256',
                    code_challenge: codeChallenge,
                })
        )
    })
}

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

export async function startAuth() {
    app.get('/callback', function (req, res) {
        var code = req.query.code || null
        var state = req.query.state || null

        if (state === null) {
            res.redirect(
                '/#' +
                    querystring.stringify({
                        error: 'state_mismatch',
                    })
            )
        } else {
            var authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                form: {
                    code: code,
                    redirect_uri: redirect_uri,
                    grant_type: 'authorization_code',
                },
                headers: {
                    Authorization:
                        'Basic ' + new Buffer(client_id + ':' + client_secret).toString('base64'),
                },
                json: true,
            }
        }
    })
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
