var express = require('express');
var router = express.Router();
var controllers = require('../controllers/userController')

var loggedin = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});
router.get('/login', function (req, res, next) {
  res.render('login');
});
router.get('/signup', function (req, res, next) {
  res.render('signup');
});
router.get('/allComplaints', loggedin, function (req, res, next) {
  res.render('allComplaints', {
    user: req.user
  });
});
router.get('/newComplaint', loggedin, (req, res, next) => {
  res.render('newComplaint');
});
router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
});
router.get('/otp', (req, res) => {
  res.render('otp');
}, controllers.generateOTP);
module.exports = router;