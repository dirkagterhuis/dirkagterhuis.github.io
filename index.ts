import express from 'express'
import path from 'path'
// import { startAuth } from './src/authorization.js'

const app = express()
console.log('dirname: ' + __dirname)
const port = process.env.PORT || 8000

const publicDirectoryPath = path.join(__dirname, './public')
console.log('__dirname: ' + __dirname)
console.log('publicDirectoryPath: ' + publicDirectoryPath)
// const viewsPath = path.join(__dirname, '../views'); //used to implement a directory other than '../views'

// Setup handlebars enginer and views location
// app.set('views', viewsPath)

// Setup static directory to serve 
app.use(express.static(publicDirectoryPath));

// app.get('/', (req, res) => {
//     res.render('index', {
//         title: 'Weather.',
//         name: 'Dirk Agterhuis'
//     })
// });
console.log('path: ' + path.join(__dirname + '/index.html'))
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})