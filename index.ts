import { loginUrl, redirect_uri } from './src/authorization'
import { config } from './config'

import express from 'express'
import path from 'path'
import axios from 'axios'
import url from 'url'
// import { startAuth } from './src/authorization.js'

const app = express()
const port = process.env.PORT || 8000

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

    const code = (req.query.code as string) || null // this works, now get token and store it on client side
    const state = req.query.state || null //todo: verify state
    const error = req.query.error || null

    if (state === null) {
        res.redirect(
            '/#' +
                new URLSearchParams({
                    error: 'state_mismatch',
                })
        )
    }

    const requestBody = new url.URLSearchParams({
        code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code',
    })

    // maybe remove the try...catch now
    let authToken: string
    try {
        const getTokenResponse = await axios.post(
            'https://accounts.spotify.com/api/token',
            requestBody.toString(),
            {
                method: 'post',
                headers: {
                    Authorization:
                        'Basic ' +
                        Buffer.from(
                            config.spotifyClientId + ':' + config.spotifyClientSecret
                        ).toString('base64'),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                // data isn't needed, it's all in the params.
                // data: requestBody.toString(),
            }
        )
        if (getTokenResponse.status === 200) {
            const data = getTokenResponse.data
            console.log('token: ' + JSON.stringify(data))
            authToken = data.access_token
        }
    } catch (error) {
        console.log(`Error: ${JSON.stringify(error.message)}`)
    }

    // make new request to get all playlists
    // source: https://developer.spotify.com/documentation/web-api/reference/#/operations/get-a-list-of-current-users-playlists
    const getPlaylistsUrl = 'https://api.spotify.com/v1/me/playlists'
    const playlists = await getPlaylists(authToken, getPlaylistsUrl, [])
    // console.log(`#### Playlist Grand : ${JSON.stringify(playlists, null, 2)}`)
    console.log(`#### Playlist Grand total: ${playlists.length}`)

    res.sendFile(path.join(__dirname + '/public/views/spotify-app.html'))
})

async function getPlaylists(token: string, url: string, playlists) {
    let totalToGet: number
    try {
        const getPlaylistResponse = await axios.get(url, {
            headers: {
                Authorization: 'Bearer ' + token,
            },
            params: {
                limit: 50,
            },
        })
        if (getPlaylistResponse.status === 200) {
            playlists.push(...getPlaylistResponse.data.items)
            totalToGet = getPlaylistResponse.data.total
        }
        const next: string = getPlaylistResponse.data.next
        if (next === null) {
            if (totalToGet !== playlists.length) {
                throw new Error(`Expected: ${totalToGet} playlists; retrieved: ${playlists.length}`)
            }
            return playlists
        }
        console.log(`Getting new page of playlists. Current size: ${playlists.length}`)
        await getPlaylists(token, next, playlists)
    } catch (error) {
        console.log(`Error: ${JSON.stringify(error.message)}`)
    }
    return playlists
}

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
