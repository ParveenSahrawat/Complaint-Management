var localStrategy = require('passport-local').Strategy;
var User = require('./db/User')


module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        // console.log(user._id);
        done(null, user)
    })
    passport.deserializeUser(function (id, done) {
        User.findById(id, (error, user) => {
            done(error, user);
        });
    });

    passport.use(new localStrategy({
        usernameField : 'email',
        passwordField : 'password'
    }, function (username, password, done) {
        User.findOne({
            email : username
        }, (err, doc) => {
            if (err) {
                done(err)
            } else {
                if (doc) {
                    var valid = doc.comparePassword(password, doc.password)
                    if (valid) {
                        // do not add password hash to session
                        done(null, {
                            // "req.user._id" : doc._id,
                            username: doc.username,
                            _id: doc._id
                        })
                    } else {
                        done(null, false)
                    }
                } else {
                    done(null, false)
                }
            }
        });
    }));
}