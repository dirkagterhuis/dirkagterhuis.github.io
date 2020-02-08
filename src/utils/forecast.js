const request = require('request');

// original: get weather
const forecast = (latitude, longitude, callback) => {
    const  url = 'https://api.darksky.net/forecast/51721783fbaeca0320b6c15a0a4600c1/' + latitude + ',' + longitude + '?units=si&';

    request({ url, json:true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather forecast services.', undefined)
        } else if (body.error) {
            callback('Unable to find forecast for location.', undefined);
        } else {
            const temperature = body.currently.temperature;
            const precipProbability = body.currently.precipProbability;
            callback(undefined, body.daily.data[0].summary + 
                ' It is currently ' + temperature + 
                ' degrees out. There is a ' + precipProbability + 
                '% change of rain.'
            );
        }
    })
}

module.exports = forecast;