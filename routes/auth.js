const express = require('express');
const router = express.Router();
const User = require('../db/User');
const controllers = require('../controllers/userController');
const passport = require('passport');

module.exports = (passport) => {
    router.post('/signup', controllers.createUser);

    // router.post('/login', passport.authenticate('local', 
    // {
    //     failureRedirect: '/login',
    //     successRedirect: `/allComplaints/${req.user}`,
    // }), (req, res, next) => {
    //    console.log(req.user);
    // });
    router.post('/login', passport.authenticate('local'), (req, res) => {

        console.log("executed login!");
        console.log(req.user._id);
        req.session.user = req.user;
        console.log(req.sessionID);
        // console.log(req.user.sessionID);

        req.logIn(req.user, (err) => {
            if (err) {
                res.redirect('/login');
            } else {
                res.redirect('/allComplaints');
                // window.location = 'allComplaints';
            }
        });
    });
    return router;
};