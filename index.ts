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

    try {
        const gettokenResponse = await axios.post(
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
                data: requestBody.toString(),
            }
        )
        if (gettokenResponse.status === 200) {
            const data = gettokenResponse.data
            console.log('token: ' + JSON.stringify(data))
            // hier gebleven
        }
    } catch (error) {
        console.log(`Error: ${JSON.stringify(error.message)}`)
    }
    res.sendFile(path.join(__dirname + '/public/views/spotify-app.html'))
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
