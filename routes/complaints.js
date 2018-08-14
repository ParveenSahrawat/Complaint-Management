const express = require('express');
const router = express.Router();
const complaintsController = require('../controllers/complaintsController');

router
    .route('/newComplaint')
        .post(complaintsController.registerNewComplaint);

module.exports = router;