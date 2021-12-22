import { loginUrl, redirect_uri, getAuthToken, state as originalState } from './src/authorization'
import { getPlaylists, getItemsByPlaylists } from './src/spotifyApiUtils'

import express from 'express'
import type { Express } from 'express'
import path from 'path'
import fs from 'fs'
import * as ejs from 'ejs'

const app: Express = express()
const port: string | number = process.env.PORT || 8000
//this is a bad idea: pass it around in functions: https://stackoverflow.com/questions/53801270/updating-res-locals-after-each-var-change
let loadingMessage: string = ''

// Setup static directory to serve
app.use(express.static(path.join(__dirname, './public')))

// Only want to use html with some variables -> using EJS
app.engine('html', ejs.renderFile)

// remember: static website uses ~/index.html; dynamic website uses ~/public/views/index.html
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/views/index.html'))
})

app.get('/spotify-app', function (req, res) {
    res.render(path.join(__dirname + '/public/views/spotify-app.html'), {
        showLoading: false,
        loadingMessage,
    })
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
    // this is breaking as it's already in the finished state: https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client
    res.render(path.join(__dirname + '/public/views/spotify-app.html'), {
        showLoading: false,
        loadingMessage: (loadingMessage += `Succesfully signed in to your Spotify Account`),
    })

    const playlists = await getPlaylists(authToken, 'https://api.spotify.com/v1/me/playlists', [])
    // also here
    // res.render(path.join(__dirname + '/public/views/spotify-app.html'), {
    //     showLoading: false,
    //     loadingMessage:
    //         (loadingMessage += `\nRetrieved ${playlists.length} playlists from your Spotify Account`),
    // })
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
