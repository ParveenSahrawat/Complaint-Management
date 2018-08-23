var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs');

var schema = mongoose.Schema;

var userSchema = new schema({
    username:{
        type:String,
        required:true,
    },
    email : {
        type : String,
        unique : true,
        required : true,
        trim : true
    },
    mobile: {
        type: String,
        
        length: 10,
        required: true
    },
    password : {
        type : String,
        required : true,
    },
    mobileVerified: {
        type: Boolean,
        default: false
    },
    aadharNumber: { 
        type: Number,
        length: 12,
        required: true
    },
    userType: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    superAdmin: {
        type: Boolean,
        default: false
    },
    accountActive: {
        type: Boolean,
        default: true
    },
    OTP: [{
        otp: {
            type: String,
            required: true
        },
        validTill: {
            type: Date,
            default: Date.now() + 300000 //5 mins from now
        },
        refNo: {
            type: String
        },
        mobile: {
            type: String,
            required: true
        }
    }]
});

userSchema.methods.hashPassword = function (password) {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10))
}

userSchema.methods.comparePassword = function (password,hash) {
    return bcrypt.compareSync(password,hash)
}

module.exports = mongoose.model('users',userSchema,'users');