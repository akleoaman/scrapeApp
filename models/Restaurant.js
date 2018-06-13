var mongoose = require('mongoose');


var Restaurant = mongoose.Schema({
    restaurant: String,
    hash: String,
    url: String,
    info: String,
    updated: { type: Date, default: Date.now },
    menu: []

    
} )
module.exports = mongoose.model('Restaurant', Restaurant);