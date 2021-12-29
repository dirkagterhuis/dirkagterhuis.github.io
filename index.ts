import { loginUrl, redirect_uri, getAuthToken, state as originalState } from './src/authorization'
import { getPlaylists, getItemsByPlaylists } from './src/spotifyApiUtils'

import express from 'express'
import type { Express } from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
// can be removed if not used in any html files
import * as ejs from 'ejs'

const app: Express = express()
const port: string | number = process.env.PORT || 8000
const server = http.createServer(app) //express does this behind the scenes anyways.
const io = new Server(server) //but you need the 'server' variable because socket.io needs it as param

interface Client {
    socketId: string
    socket: any
    state: string
}
let clients: Client[] = []

// Setup static directory to serve
app.use(express.static(path.join(__dirname, './public')))
// To do: add domain of app
app.use(
    cors({
        origin: 'http://localhost:8000',
    })
)

// Only want to use html with some variables -> using EJS
app.engine('html', ejs.renderFile)

// remember: static website uses ~/index.html; dynamic website uses ~/public/views/index.html
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/views/index.html'))
})

app.get('/spotify-app', function (req, res) {
    res.render(path.join(__dirname + '/public/views/spotify-app.html'), {
        showLoading: false,
    })
    console.log(`Clients @ /spotify-app: ${JSON.stringify(clients)}`)
})

app.get('/spotify-app-callback', async function (req, res) {
    // use 'redirect', not 'render', as to remove the code from the url
    res.redirect('/spotify-app')

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

    // this is a bit dodgy as socket.io creating the client will race with getting the auth token
    const client = clients.find((obj) => {
        return obj.state === state
    })
    if (!client) {
        throw new Error(`Request not coming from an active session.`)
    }

    sendMessageToClient(client.socketId, `Succesfully signed in to your Spotify Account`)

    const playlists = await getPlaylists(authToken, 'https://api.spotify.com/v1/me/playlists', [])

    sendMessageToClient(
        client.socketId,
        `Retrieved ${playlists.length} playlists from your Spotify Account`
    )

    await getItemsByPlaylists(authToken, playlists, sendMessageToClient, client.socketId)

    // perhaps you don't want this locally, see if you can serve a json without a file, e.g.: https://stackoverflow.com/questions/25434506/download-file-from-json-object-in-node-js
    // instead of this, offer the file to download directly in client browser
    fs.writeFileSync('./playlists.json', JSON.stringify(playlists, null, 2))

    // res.redirect('/spotify-app')

    // to serve a local file, but perhaps you don't want to save it on the server. Or make it unique and delete it afterwards.
    // res.download(path.join(__dirname + '/playlists.json'))
})

io.on('connection', (socket) => {
    console.log(`Connected`)
    console.log(`Socket Id is: ${socket.id}`)
    clients.push({
        socketId: socket.id,
        socket,
        state: originalState,
    })

    // don't throw away yet depending on whether you want to identify users based on the (unique?) state
    // io.to(socket.id).emit('sessionId', {
    //     body: sessionId,
    // })

    socket.on('disconnect', () => {
        console.log('user disconnected')
        clients = clients.filter(function (client) {
            return client.socketId !== socket.id
        })
    })
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

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})

function sendMessageToClient(socketId, message: string) {
    io.to(socketId).emit('loadingMessage', {
        body: message,
    })
}
