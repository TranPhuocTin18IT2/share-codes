const express = require('express')
const app = express()
const mongoose = require('mongoose')
const assert = require('assert')
const uri =
    "mongodb://dbSICT:sictK18@anonymous-shard-00-01-app1j.mongodb.net:27017/weather-chat-bot?ssl=true&replicaSet=anonymous-shard-0&authSource=admin"

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    assert.equal(null, err)
    console.log('connected')
})
// require('./testing')
require('./load')
app.listen(3005)