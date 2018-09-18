const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs');
const schema = mongoose.Schema;

const userSchema = new schema({
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
        maxlength: 10,
        required: true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    emailVerified : {
        type : Boolean,
        default : false
    },
    mobileVerified: {
        type: Boolean,
        default: false
    },
    aadharNumber: { 
        type: Number,
        length: 12,
        required: true,
        unique : true
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