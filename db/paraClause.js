const mongoose = require('mongoose');
const paraLinkSchema = new mongoose.Schema({
    paraClauseLink : {
        type: String,
        required: false,
        trim: true
    }
});

module.exports = mongoose.model('paralinks', paraLinkSchema, 'paralinks');