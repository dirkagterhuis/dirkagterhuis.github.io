import { clientId } from './secrets'
// import { Express } from 'express'

var redirect_uri = 'http://localhost:8000/views/spotify-app.html'

var app = express()

export function startAuth() {
    app.get('/login', function (req, res) {
        var state = generateRandomString(16)
        var scope = 'playlist-read-private'

        res.redirect(
            'https://accounts.spotify.com/authorize?' +
                querystring.stringify({
                    response_type: 'code',
                    client_id: clientId,
                    scope: scope,
                    redirect_uri: redirect_uri,
                    state: state,
                })
        )
    })
}
