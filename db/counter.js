var mongoose = require('mongoose');

var counterSchema = mongoose.Schema({
    for : {
        type : String,
        required : true
    },
    seq : {
        type : Number,
        default : 0
    }
});

module.exports = mongoose.model('counters',counterSchema, 'Counter');
