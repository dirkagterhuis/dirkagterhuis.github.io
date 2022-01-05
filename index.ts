import { generateState, getSpotifyLoginUrl, getAuthToken } from './src/authorization'
import { getPlaylists, getItemsByPlaylists } from './src/spotifyApiUtils'

import express from 'express'
import type { Express } from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import path from 'path'
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
    console.log(`# Clients @ /spotify-app: ${clients.length}`)
})

app.get('/login', function (req, res) {
    console.log('CLICK!')
    // TO DO: use separate attribute for state vs. session id
    const state: string = req.query.state as string
    const loginUrl: string = getSpotifyLoginUrl(state)
    res.redirect(loginUrl)
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

    // Only do this when developing locally; you don't want this when it's a live server
    // if (port === 8000) {
    //     fs.writeFileSync('./playlists.json', JSON.stringify(playlists, null, 2))
    // }

    const dataStr =
        'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(playlists, null, 2))
    io.to(client.socketId).emit('readyForDownload', {
        body: dataStr,
    })
})

io.on('connection', (socket) => {
    console.log(`Connected`)
    console.log(`Socket Id is: ${socket.id}`)

    let state: string
    socket.on('state', function (event) {
        if (!event.body) {
            throw new Error(`Incoming state on Server is undefined`)
        }
        state = event.body

        // first check if client exists already based on state
        const matchingClients = clients.filter((client) => {
            return client.state === state
        })
        if (matchingClients.length > 1) {
            throw new Error(`Multiple clients with the same state`)
        }
        if (matchingClients.length === 0) {
            clients.push({
                state,
                socketId: socket.id,
                socket,
            })
        } else {
            matchingClients[0].socket = socket
            matchingClients[0].socketId = socket.id
        }
    })

    // clear client after 1 hour
    socket.on('disconnect', () => {
        console.log('user disconnected')
        setTimeout(function () {
            try {
                clients = clients.filter(function (client) {
                    return client.socketId !== socket.id
                })
            } catch (error) {
                console.log(`Failed to remove client after timeout; socket Id: ${socket.id}`)
            }
        }, 3600000)
    })
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
