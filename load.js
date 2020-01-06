const Model = require('./models/weatherbox')

Model.find({location: {city: 'Danang'}},function(err, docs){
    console.log(docs)
})