const express = require('express');
const router = express.Router();
const complaintsController = require('../controllers/complaintsController');
const multer = require('multer');

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        console.log("ABCED");
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

const upload = multer({ storage : storage });

router.route('/newComplaint').post(upload.any(), complaintsController.registerNewComplaint);
//router.route('/newComplaint').get(complaintsController.showPDF);

module.exports = router; 