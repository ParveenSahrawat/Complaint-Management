var express = require('express');
var router = express.Router();
var User = require('../db/User');

/* GET home page. */


module.exports = function (passport) {
    router.post('/signup', function (req, res) {
        // var body = req.body,
        //     username = body.username,
        //     password = body.password;
        User.findOne({
            email : req.body.email
        }, function (err, doc) {
            if (err) {
                res.status(500).send('error occured')
            } else {
                if (doc) {
                    res.status(500).send('Username already exists')
                } else {
                    var record = new User()
                    record.username = req.body.username;
                    record.email = req.body.email;
                    record.mobile = req.body.mobile;
                    record.aadharNumber = req.body.aadharNumber;
                    record.password = record.hashPassword(req.body.password);
                    record.save(function (err, user) {
                        if (err) {
                            res.status(500).send(err)
                        } else {
                            res.redirect('/login')
                        }
                    })
                }
            }
        })
    });


    router.post('/login', passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/profile',
    }), function (req, res) {
        res.send('hey')
    })
    return router;
};