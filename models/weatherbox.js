const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const weatherModel = new Schema({
    location:{
        city: {type: String},
        country: {type: String},
        coords: {
            latitude: {type: Number},
            longitude: {type: Number}
        }
    },
    forecast: [{
            date: {
                from: {type: Date},
                to: {type: Date}
            },
            state: {type: String},
            temperature: {
                min: {type: Number},
                max: {type: Number},
                value: {type: Number}
            },
            windSpeed: {
                mps: {type: Number},
                name: {type: String}
            },
            humidity: {
                value: {type: Number},
                unit: {type: String}
            },
            cloudiness: {
                value: {type: String},
                all: {type: Number},
                unit: {type: String}
            }
     }]
});
module.exports = mongoose.model("weather_box", weatherModel);

