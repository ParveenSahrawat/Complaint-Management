const express = require('express');
const router = express.Router();
const complaintsController = require('../controllers/complaintsController');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage : storage });

router.route('/newComplaint').post(upload.any(), complaintsController.registerNewComplaint);
// router.route('/complaints').get(complaintsController.listAllComplaints);

module.exports = router; 