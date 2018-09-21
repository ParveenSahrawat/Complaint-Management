const express = require('express');
const router = express.Router();
const controllers = require('../controllers/userController');
const complaintsController = require('../controllers/complaintsController');
const usersController = require('../controllers/userController');


const loggedin = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}
// login and signup routes
router.get('/', (req, res) => {
  res.render('index');
});
router.get('/login', (req, res) => {
  res.render('login');
});
router.get('/validation', (req, res) => {
    res.render('validation');
});
router.get('/signup', (req, res) => {
  res.render('signup');
});
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/login')
});
// reset password
router.get('/resetPassword', (req, res) => {
  res.render('forgotPassword');
});
router.post('/resetPassword', usersController.resetPassword);
// profile routes
router.get('/profile', loggedin, (req, res) => {
  res.render('profile', {
    usertype : req.user.userType
  });
});
router.get('/getProfileDetails', loggedin, usersController.fetchLoggedUserDetails);
router.patch('/profile', loggedin, usersController.editUserDetails);
router.patch('/changePassword', loggedin, usersController.changePassword);
// complaints routes
router.post('/complaints/updateStatus/:_id', loggedin, complaintsController.updateStatus);
router.get('/complaints', loggedin, (req, res) => {
  res.render('allComplaints', {
    user : req.user.username
  });
});
router.get('/complaint/:_id', loggedin, complaintsController.getComplaint);
router.get('/view/:_id', loggedin, (req, res) => {
  res.render('preview', {
    id : req.params._id,
    usertype : req.user.userType
  });
});
router.get('/getComplaints', loggedin, complaintsController.listAllComplaints);

router.get('/newComplaint', loggedin, (req, res) => {
  res.render('newComplaint');
});
// router.get('/view/', loggedin, (req, res) => {
//   res.render('preview', {
//     id : req.params._id
//   });
// });
router.get('/otp', (req, res) => {
  res.render('otp');
}, controllers.generateOTP);

// Admin routes
router.get('/allComplaints', loggedin, (req, res) => {
  res.render('charts');
});
router.get('/getAllComplaints', loggedin, complaintsController.listAllComplaints);
router.get('/dashboard', loggedin, (req, res) => {
  res.render('adminDashboard', {
    usertype : req.user.userType
  });
});
router.get('/dashboardComplaints', loggedin, complaintsController.getAllComplaintsForAdmin);



module.exports = router;