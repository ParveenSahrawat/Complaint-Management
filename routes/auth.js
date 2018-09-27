const express = require('express');
const router = express.Router();
const User = require('../db/User');
const controllers = require('../controllers/userController');
const passport = require('passport');

module.exports = (passport) => {
    router.post('/signup', controllers.createUser);
    router.post('/login', passport.authenticate('local', {failureRedirect : '/login'}), (req, res) => {
        // console.log("executed login!");
        // console.log(req.user._id);
        req.session.user = req.user;
        // console.log(req.sessionID);
        // console.log(req.user.sessionID);
        req.logIn(req.user, (err) => {
            if (err) {
                console.log(err);
                res.redirect('/login');
            } else {
                console.log(req.user);
                if(!(req.user.mobileVerified)){
                    res.redirect('/otp');
                }
                else if(req.user.userType === 'user')
                    res.redirect('/complaints');
                else if(req.user.userType === 'admin')
                    res.redirect('/dashboard');
            }
        });
    });
    return router;
};