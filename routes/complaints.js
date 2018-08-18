const express = require('express');
const router = express.Router();
const complaintsController = require('../controllers/complaintsController');

router.route('/newComplaint').post(complaintsController.registerNewComplaint);
// router.route('/complaints').get(complaintsController.listAllComplaints);

module.exports = router;