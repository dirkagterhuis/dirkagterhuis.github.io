import express from 'express'
import path from 'path'
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
