const request = require('request');
const yargs = require('yargs');
let api = '985a4842cf4e66dda685ffaa90e3c7db'

let getWeather = (lat, lng, callback) => {
    request({
        url: `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${api}`,
        json: true
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            callback(undefined, {
                temperature: body.main.temp,
                apparentTemperature: body.main.feels_like
            });
        } else {
            callback('Unable to fetch weather.');
        }

    });
};

module.exports.getWeather = getWeather;