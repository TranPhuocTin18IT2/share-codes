
const request = require('request')
const parseString = require('xml2js').parseString
const util   = require('util')
const inspect = require('eyes').inspector({maxLength:false})
let apikey    = '5e93b605b28ee0aae9b2d53f134d439b'
let cities    = 'danang'
let countries = 'vn'
let url       = `https://api.openweathermap.org/data/2.5/forecast?q=${cities},${countries}&mode=xml&appid=${apikey}`

request(url,(err,response,data)=>{
	// console.log(data.location);
        parseString(data,{trim:true},(err,result)=>{
                let root = result.weatherdata
                // console.dir(JSON.stringify(root));
                let forecast = Array.from(root.forecast[0].time).map((p)=> ({
                                	time : {
            		                			from : p.$.from,
            		                			to : p.$.to,
                		                		state : p.symbol[0].$.name,
                		                		temp : {
                		                			min : p.temperature[0].$.min,
                		                			max : p.temperature[0].$.max,
                		                		},
                		                		humidity : {
                		                			value : p.humidity[0].$.value,
                		                			unit : p.humidity[0].$.unit
                		                		},
                		                		clouds : {
                		                			value : p.clouds[0].$.value,
                		                			all : p.clouds[0].$.all,
                		                			unit : p.humidity[0].$.unit
                		                		}
                            				},
                                })
                )
                // console.log(JSON.stringify(rs));
                let template = {
	                	location : {
			                		city    : root.location[0].name[0],
			                		country : root.location[0].country[0],
			                		coord   :{
			                			latitude  : root.location[0].location[0].$.latitude,
			                			longitude : root.location[0].location[0].$.longitude
			                		}
	                			},
	                	forecast :[forecast]
                }
                console.log(inspect(template))
                console.log(root.forecast[0].time[2].clouds[0].$.value);
	})
})

