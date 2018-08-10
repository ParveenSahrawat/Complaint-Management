const express = require('express');
const router = express.Router();
const User = require('../db/User');
const controllers = require('../controllers/userController');
const passport = require('passport');

module.exports = (passport) => {
    router.post('/signup', controllers.createUser);

    router.post('/login', passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/profile',
    }), function (req, res) {
        res.send('hey')
    })
    return router;
};