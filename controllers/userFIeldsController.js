const validator = require('validator');

module.exports.checkUserFields = (req, res) => {
    // Validating username
    if (typeof (req.body.username) == "undefined") {
        return res.status(400).json({
            msg: 'username missing',
            status: 0,
            request: req.body
        });
    }
    else {
        var username = req.body.username;
        if (!validator.trim(username).length) {
            return res.status(400).json({
                msg: 'username can\'t be empty',
                status: 0
            });
        }
    }
    // Validating Email
    if (typeof (req.body.email) == "undefined") {
        return res.status(400).json({
            msg: 'email missing',
            status: 0
        });
    }
    else {
        if (!validator.isEmail(req.body.email)) {
            return res.status(400).json({
                msg: 'Invalid Email',
                status: 0
            });
        }
        else {
            var email = req.body.email;
        }
    }
    // Validating Aadhar Number
    if (typeof (req.body.aadharNumber) == "undefined") {
        return res.status(400).json({
            msg: 'aadharNumber missing',
            status: 0
        });
    }
    else {
        if (!(validator.isNumeric(req.body.aadharNumber) && (validator.trim(req.body.aadharNumber).length == 12))) {
            return res.status(400).json({
                msg: 'Invalid aadharNumber',
                status: 0
            });
        }
        else {
            var aadharNumber = req.body.aadharNumber;
        }
    }
    // Validating Mobile
    if (typeof (req.body.mobile) == "undefined") {
        return res.status(400).json({
            msg: 'mobile missing',
            status: 0
        });
    }
    else {
        if (!validator.isMobilePhone(req.body.mobile, ['en-IN'])) {
            return res.status(400).json({
                msg: 'Invalid Mobile Number',
                status: 0
            });
        }
        else
            var mobile = req.body.mobile;
    }
}