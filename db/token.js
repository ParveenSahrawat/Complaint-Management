const mongoose = require('mongoose')

const schema = mongoose.Schema;
const tokenSchema = new schema({
    _userId : { 
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'users'
    },
    token : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now(),
        expires : 43200
    }
});

module.exports = mongoose.model('token',tokenSchema, 'tokens');
