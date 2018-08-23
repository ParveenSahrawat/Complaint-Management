const mongoose = require('mongoose');
const Complaint = require('../db/complaints');
const _ = require('lodash');
const validator = require('validator');

module.exports.registerNewComplaint = (req, res) => {
    // var req.body = _.pick(req.body, ['complaintType', 'location', 'relevantParaClause', 'objectionOrSuggestion', 'complaintDesc', 'paraClauseLink']);
    // console.log(req.sessionID);
    // console.log(req.user._id);
    // console.log(`form body is ${req.body}`);
    // console.log(req.user);
    if (typeof (req.body.complaintType) == "undefined") {
        return res.status(400).json({
            status: 0,
            msg: 'Complaint Type required'
        });
    }
    else {
        if (["Land Use Proposals", "Zoning Acquisition", "Infrastructure Provisions", 
             "Demographic & Population Projections", "Environment Related", "MCA/Control Area/Village Boundary", 
             "Traffic & Transportation", "Others"].indexOf(validator.trim(req.body.complaintType)) == -1) {
            return res.status(400).json({
                status: 0,
                msg: 'Complaint Type required'
            });
        }
    }

    if (typeof (req.body.location) == "undefined") {
        return res.status(400).json({
            status: 0,
            msg: 'Location iiis required'
        });
    }
    else {
        if (!validator.trim(req.body.location)) {
            return res.status(400).json({
                status: 0,
                msg: 'Location is required'
            });
        }
    }

    if (typeof (req.body.relevantParaClause) == "undefined") {
        return res.status(400).json({
            status: 0,
            msg: 'Please enter relevant Para/Clause'
        });
    }
    else {
        if (!validator.trim(req.body.relevantParaClause)) {
            return res.status(400).json({
                status: 0,
                msg: 'Please enter relevant Para/Clause'
            });
        }
    }

    if (typeof (req.body.complaintDesc) == "undefined") {
        return res.status(400).json({
            status: 0,
            msg: 'Complaint Description is required'
        });
    }
    else {
        if (!validator.trim(req.body.complaintDesc)) {
            return res.status(400).json({
                status: 0,
                msg: 'Complaint Description is required'
            });
        }
    }

    if (typeof (req.body.objectionOrSuggestion) == "undefined") {
        return res.status(400).json({
            status: 0,
            msg: 'Select whether its a complaint or suggestion.'
        });
    }
    else {
        if (['Objection', 'Suggestion'].indexOf(validator.trim(req.body.objectionOrSuggestion)) === -1) {
            return res.status(400).json({
                status: 0,
                msg: 'Select whether its a complaint or suggestion.'
            });
        }
    }
       
        // Complaint.findOneAndUpdate({ _id : req.user._id}, { $inc : { counter : 1}}, { new : true }, (error, res) => {
        //     if(error)
        //         return error;
        //     else {
        //         return res;
        //     }
        // }) 

       let newComplaint = new Complaint({
        // complaintNumber : req.body.counter,
        complaintType : req.body.complaintType,
        location : req.body.location,
        relevantParaClause : req.body.relevantParaClause,
        complaintDesc : req.body.complaintDesc,
        objectionOrSuggestion : req.body.objectionOrSuggestion,
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
                msg: 'Server Error while saving new complaint',
                errorDetails: err
            });
        }
        else {
            res.json({
                status: 1,
                msg: `Your ${registeredComplaint.objectionOrSuggestion} is successfully registered.`,
                refNo: registeredComplaint.complaintNumber
            });
        }
    });
}

module.exports.listAllComplaints = (req, res, next) => {
    if (req.user.userType === "user") {
        var query = Complaint.find({
            $query : { complainant: req.user._id },
            $orderby : { postedOn : -1 }
        })
        // , '-actionTrail -official -_id -__v').populate('complainant', 'name-_id').exec();
    }
    else {
        var query = Complaint.find({}, '-actionTrail -_id -__v').populate([{
            path: 'complainant',
            select: 'name-_id'
        }]).exec();
    }

    query.then((allcomplaints) => {
        return res.send({
            status: 1,
            data: allcomplaints
        })
    }).catch((e) => {
        return res.status(500).json({   
            status: 0,
            msg: 'Server Error',
            errorDetails: e
        });
    });
}

module.exports.getComplaint = (req, res) => {
    var { _id } = req.params;
        if (req.user.userType == "user") {

            var query = Complaint.findOne({
                _id,
                complainant: req.user._id
            }, ' -official -_id -__v')
                .populate([{
                    path: 'complainant',
                    select: 'name-_id'
                }, {
                    path: 'actionTrail.user',
                    select: 'userType-_id'
                }]).exec();
        }
        else {
            var query = Complaint.findOne({
                _id
            }, '-_id -__v')
                .populate({
                    path: 'complainant',
                    select: 'name mobile email-_id'
                })
                .populate({
                    path: 'actionTrail.user',
                    select: 'name userType-_id'
                })
                .exec();
        }
        query.then((complaint) => {
            if (!complaint) {
                return res.status(404).status({
                    status: 0,
                    msg: 'The requested resources does not exist or you do not have sufficient priviledge to access it.'
                });
            }
            else {
                return res.send(complaint);
            }
        })
    }
    // else {
    //     return res.status(400).json({
    //         status: 0,
    //         msg: 'Invalid Request.'
    //     });
    // }
 

module.exports.updateStatus = (req, res) => {

}

module.exports.getStats = (req, res) => {

}