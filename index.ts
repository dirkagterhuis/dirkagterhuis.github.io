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

    const code = req.query.code || null // this works, now get token and store it on client side
    let code2
    // this did something, but now i get back empty error
    // const code = (req.query.code as string) || null // this works, now get token and store it on client side

    if (req.query && req.query.code) {
        code2 = (req.query as any).code
    }

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

    const requestBody = new url.URLSearchParams({ test: 'test' })
    requestBody.append('code', code2) // remove stringify here, it messes up the code
    requestBody.append('redirect_uri', redirect_uri)
    requestBody.append('grant_type', 'authorization_code')

    console.log(`request body: ${JSON.stringify(requestBody)}`)

    try {
        console.log('here')
        const tokenResponse = await axios.post(
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
        console.log('response: ' + JSON.stringify(tokenResponse))
        if (tokenResponse.status === 200) {
            const token = tokenResponse.request.access_token
            console.log('token: ' + token)
        }
    } catch (error) {
        console.log(`Error: ${JSON.stringify(error)}`)
        console.log('$$$$$$$$$$$$$$$$')
        console.log(JSON.stringify(error.statusText))
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
