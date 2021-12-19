import { loginUrl, redirect_uri, getAuthToken, state as originalState } from './src/authorization'
import { getPlaylists, getItemsByPlaylists } from './src/spotifyApiUtils'

import express from 'express'
import type { Express } from 'express'
import path from 'path'
import fs from 'fs'

const app: Express = express()
const port: string | number = process.env.PORT || 8000

// Here you might have to setup a view engine if you want to do something else rather than only serve static content.
// If you do that, do use the `index.html` in root, not in `/public`
// app.set('views', path.join(__dirname, '../views')) //used to implement a directory other than '../views'

// Setup static directory to serve
app.use(express.static(path.join(__dirname, './public')))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/views/index.html'))
})

app.get('/spotify-app', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/views/spotify-app.html'))
})

app.get('/spotify-app-callback', async function (req, res) {
    console.log('code', req.query.code)
    console.log('state', req.query.state)
    console.log('error', req.query.error)

    const code: string = (req.query.code as string) || null
    const state = req.query.state || null
    const error = req.query.error || null

    if (state !== originalState) {
        res.redirect(
            '/#' +
                new URLSearchParams({
                    error: 'state_mismatch',
                })
        )
    }

    const authToken = await getAuthToken(code)
    const playlists = await getPlaylists(authToken, 'https://api.spotify.com/v1/me/playlists', [])
    await getItemsByPlaylists(authToken, playlists)

    // perhaps you don't want this locally, see if you can serve a json without a file, e.g.: https://stackoverflow.com/questions/25434506/download-file-from-json-object-in-node-js
    fs.writeFileSync('./playlists.json', JSON.stringify(playlists, null, 2))

    res.redirect('/spotify-app')
    // to serve a local file, but perhaps you don't want to save it on the server. Or make it unique and delete it afterwards.
    // res.download(path.join(__dirname + '/playlists.json'))
})

app.get('/login', function (req, res) {
    console.log('CLICK!')
    res.redirect(loginUrl)
})

app.get('/weather-app', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/views/weather-app.html'))
})

app.get('/chat-app', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/views/chat-app.html'))
})

app.get('/about', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/views/about.html'))
})

app.get('/help', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/views/help.html'))
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})
