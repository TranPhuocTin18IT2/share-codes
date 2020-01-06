
const Model = require('./models/weatherbox')
const request = require('request-promise')
const parseString = require("xml2js").parseString
const  dateFormat = require('dateformat')
const key = "5e93b605b28ee0aae9b2d53f134d439b";
let cities = "haiphong";
let countries = "vn";
let url = `https://api.openweathermap.org/data/2.5/forecast?q=${cities},${countries}&mode=xml&appid=${key}`;
let senderID = 2564303896996801

// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
//     assert.equal(null, err)
//         console.log('connected')
// })
let test = async (senderID) =>{
    await coordinates(senderID, (details) =>{
        // console.log(details.country)
        request(url, (err, response, data) => {
            parseString(data, { trim: true }, (err, result) => {
                let root = result.weatherdata
                let forecast = Array.from(root.forecast[0].time).map(p => ({
                        date: {
                            from: dateFormat(new Date(p.$.from),"yyyy-mm-dd h:MM:ss"),
                            to: dateFormat(new Date(p.$.to),"yyyy-mm-dd h:MM:ss")
                        },
                        state: p.symbol[0].$.name,
                        temperature: {
                            min: p.temperature[0].$.min,
                            max: p.temperature[0].$.max,
                            value: p.temperature[0].$.value
                        },
                        windSpeed: {
                            mps: p.windSpeed[0].$.mps,
                            name: p.windSpeed[0].$.name
                        },
                        humidity: {
                            value: p.humidity[0].$.value,
                            unit: p.humidity[0].$.unit
                        },
                        cloudiness: {
                            value: p.clouds[0].$.value,
                            all: p.clouds[0].$.all,
                            unit: p.clouds[0].$.unit
                        }
                }))
                let xyz = new Model({
                    location: {
                        city: root.location[0].name[0],
                        country: root.location[0].country[0],
                        coords: {
                            latitude: root.location[0].location[0].$.latitude,
                            longitude: root.location[0].location[0].$.longitude
                        }
                    },
                    forecast: forecast
                })
                console.log(xyz)
                xyz.save((err, Model)=>{
                    if (err) return console.error(err);
                    console.log(Model.name + " saved to weather_box collection.");
                });
            });
        });
    })
}
let coordinates = (senderID,details) =>{
        return request(
            {
                url: `https://graph.facebook.com/v3.2/${senderID}`,
                qs: {
                    access_token:'EAAFlZCptZBM7oBALUdCCug3c0cDVZCGQLVxDeP7MzdeJyYwalcmf6xKEDsBqRBbgg76jaziZBTITCHih2gQekx4sjpZB08IMiytxZBhqyZCMk2I2yRIc8QpLb8cNYWGlbIx6GfZBTOzpTcPGdZCDbeyJwXgaUnnfsbO1hMUZCbMebcM9oEYx1B081G',
                    fields: "name"
                },
                method: "GET"
            },
            (err, response, body) => {
                if (!err) {
                    return details(JSON.parse(body))
                }
            }
        )
}
test(senderID)