const mongoose = require('mongoose');
const Complaint = require('../db/complaints');
const _ = require('lodash');
const validator = require('validator');

module.exports.registerNewComplaint = (req, res) => {
    var complaintBody = _.pick(req.body, ['complaintType', 'location', 'relevantParaClause', 'objectionOrSuggestion', 'complaintDesc', 'paraClauseLink']);
    console.log(req.user._id);
    
    console.log(complaintBody);
    console.log(req.user);
    if (typeof (complaintBody.complaintType) == "undefined") {
        return res.status(400).json({
            status: 0,
            msg: 'Complaint Type required'
        });
    }
    else {
        if (["Land Use Proposals", "Zoning Acquisition", "Infrastructure Provisions", 
             "Demographic & Population Projections", "Environment Related", "MCA/Control Area/Village Boundary", 
             "Traffic & Transportation", "Others"].indexOf(validator.trim(complaintBody.complaintType)) == -1) {
            return res.status(400).json({
                status: 0,
                msg: 'Complaint Type required'
            });
        }
    }

    if (typeof (complaintBody.location) == "undefined") {
        return res.status(400).json({
            status: 0,
            msg: 'Location is required'
        });
    }
    else {
        if (!validator.trim(complaintBody.location)) {
            return res.status(400).json({
                status: 0,
                msg: 'Location is required'
            });
        }
    }

    if (typeof (complaintBody.relevantParaClause) == "undefined") {
        return res.status(400).json({
            status: 0,
            msg: 'Please enter relevant Para/Clause'
        });
    }
    else {
        if (!validator.trim(complaintBody.relevantParaClause)) {
            return res.status(400).json({
                status: 0,
                msg: 'Please enter relevant Para/Clause'
            });
        }
    }

    if (typeof (complaintBody.complaintDesc) == "undefined") {
        return res.status(400).json({
            status: 0,
            msg: 'Complaint Description is required'
        });
    }
    else {
        if (!validator.trim(complaintBody.complaintDesc)) {
            return res.status(400).json({
                status: 0,
                msg: 'Complaint Description is required'
            });
        }
    }

    if (typeof (complaintBody.objectionOrSuggestion) == "undefined") {
        return res.status(400).json({
            status: 0,
            msg: 'Select whether its a complaint or suggestion.'
        });
    }
    else {
        if (['Objection', 'Suggestion'].indexOf(validator.trim(complaintBody.objectionOrSuggestion)) === -1) {
            return res.status(400).json({
                status: 0,
                msg: 'Select whether its a complaint or suggestion.'
            });
        }
    }
    let newComplaint = new Complaint({
        complaintType : complaintBody.complaintType,
        location : complaintBody.location,
        relevantParaClause : complaintBody.relevantParaClause,
        complaintDesc : complaintBody.complaintDesc,
        objectionOrSuggestion : complaintBody.objectionOrSuggestion,
        complainant : req.user._id,
        actionTrail : [{
            user : req.user._id,
            action : 'Submitted',
            datetime : Date.now()
        }],
        postedOn : Date.now()
    });
    console.log(`It's going on`);
    newComplaint.save((err, registeredComplaint) => {
        if (err) {
            res.status(500).json({
                status: 0,
                msg: 'Server Error',
                errorDetails: err
            });
        }
        else {
            res.json({
                status: 1,
                msg: `Your ${registeredComplaint.objectionOrSuggestion} was successfully registered.`,
                refNo: registeredComplaint.complaintNumber
            });
        }
    });

}

module.exports.listAllComplaints = (req, res) => {

}

module.exports.getComplaint = (req, res) => {

} 

module.exports.updateStatus = (req, res) => {

}

module.exports.getStats = (req, res) => {

}