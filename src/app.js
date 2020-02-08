const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

// Define paths for Express config
// console.log(path.join(__dirname, '../public'));
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views'); //used to implement a directory other than '../views'
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars enginer and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath)
hbs.registerPartials(partialsPath);

// Setup static directory to serve 
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather.',
        name: 'Dirk Agterhuis'
    })
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Dirk Agterhuis'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'Help me out bro!',
        title: 'Help',
        name: 'Dirk Agterhuis'
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.requestedLocation) {
        return res.send({
            error: 'You must provide an address yo.'
        });
    }

    geocode(req.query.requestedLocation, (error, { latitude, longitude, location }) => {    
        if (error) {
            return res.send({ error }) //short for: "error: error" (object shorthand property)
        }
    
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                requestedLocation: req.query.requestedLocation,
                location, //short for: "location: location" (object shorthand property)
                forecast: forecastData
            })
        })
    })
});

//not used in app, only in challenge
app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        });
    }
    console.log(req.query);
    res.send({
        products: []
    })
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Help article not found.',
        name: 'Dirk Agterhuis'
    })
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Page not found.',
        name: 'Dirk Agterhuis'
    });
});

app.listen(3000, () => {
    console.log('Server is up on port 3000.');
});

// //if you go to localhost:3000 or app.com. Example only sending back a string
// app.get('/help', (req, res) => {
//     res.send('<h1>Help page!</h1>')
// });

//if you go to localhost:3000 or app.com. outcommented because app.use now finds a file (asset) to serve, in a 
//directory called 'public'. -> all 'app.get' is replaced by 'app.use' 
// app.get('', (req, res) => {
//     res.send('<h1>Weather</h1>')
// });

//if you go to localhost:3000/help or app.com/help
// app.get('/help', (req, res) => {
//     res.send([{
//         name: 'Dirk',
//         age: 32
//     }, {
//         name: 'Sarah'
//     }]);
// });

// app.get('/about', (req, res) => {
//     res.send('<h1>About page</h1>');
// });
