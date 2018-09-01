const mongoose = require('mongoose');
const Complaint = require('../db/complaints');
const User = require('../db/User');
const _ = require('lodash');
const validator = require('validator');
const fs = require('fs');
const moment = require('moment');
const nodemailer = require('nodemailer');
const {adminEmailAddress, adminName, emailConfig} = require('../config/email');
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
    console.log(req.file);
       let newComplaint = new Complaint({
        // complaintNumber : req.body.counter,
        complaintType : req.body.complaintType,
        location : req.body.location,
        relevantParaClause : req.body.relevantParaClause,
        complaintDesc : req.body.complaintDesc,
        objectionOrSuggestion : req.body.objectionOrSuggestion,
        // image : {
        //     path : req.file,
        //     originalName : req.file.originalname
        // },
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
        query.then((allcomplaints) => {
            return res.send({
                status: 1,
                data: allcomplaints
            })
        }).catch((e) => {
            return res.status(500).json({   
                status: 0,
                message: 'Server Error',
                errorDetails: e
            });
        });
        // , '-actionTrail -official -_id -__v').populate('complainant', 'name-_id').exec();
    }
    else {
        // var query = Complaint.find({}, '-actionTrail -_id -__v').populate([{
        //     path: 'complainant',
        //     select: 'name-_id'
        // }]).exec();
        var query = Complaint.find({}).exec((err, result) => {
            if(err){
                console.log('Error in finding complaints');
            } else if(result){
                console.log('Complaints are fetched');
                // console.log(result);
                var counts = {};
                result.forEach((comp) => {
                    counts[comp.complaintType] = (counts[comp.complaintType] || 0) +1;
                });
                var monthArray = [];
                for(var i=0; i<12; i++){
                    monthArray[i] = 0;
                }
                for(var i=0; i< result.length; i++){
                    var index = parseInt(moment(result[i].postedOn).format('L').split('/')[0])-1;
                    // console.log(index);
                    monthArray[index]++;
                }
                // console.log(monthArray);
                var pendingCount = 0;
                var repliedCount = 0;
                for(var i=0; i < result.length; i++){
                    if(result[i].status === 'Replied'){
                        repliedCount++;
                    } else 
                        pendingCount++;
                }
                var statusCount = [pendingCount,repliedCount];

                return res.send({
                    status : 200,
                    results : {counts, statusCount, monthArray}
                });
            }
        });   
    }  
}
module.exports.getAllComplaintsForAdmin = (req, res) => {
    if(req.user.userType === 'admin'){
        Complaint.find({
            $query : {},
            $orderby : { postedOn : 1}
        }).exec((err, result) => {
            if(err){
                console.log('error in finding complaints');
                return res.send({
                    status : 0,
                    errorDetails : err
                });
            } else if(result){
                console.log('Complaints found');
                return res.send({
                    status : 1,
                    data : result
                });
            }
        });
    }
}
module.exports.getComplaint = (req, res, next) => {
    var complaintId = req.params._id;
    Complaint.findById(complaintId).exec((error, doc) => {
        if(error){
            console.log('Error in finding complaint');
            res
                .status(500)
                .json(error);
        } else if(!doc){
            res
                .status(404)
                .json("Complaint Id not found");
        }
        res
            .status(200)
            .json(doc);
        // next(doc);
    });
}    
module.exports.updateStatus = (req, res) => {
    if(typeof(req.body.newStatus !== 'undefined') && ['Under Consideration', 'Replied'].indexOf(validator.trim(req.body.newStatus)) !== -1){
        var newStatus = req.body.newStatus;
    }
    let complaintId = req.params._id;
    // var comp = Complaint.distinct(complainant, {"_id" : complaintId});
    // console.log(comp);
    Complaint.findById(complaintId).then((complaint) => {
        if(!complaint){
            res.status(400).send('Complaint with this id doesn\'t exist');
        } else {
            let user = complaint.complainant;
            Complaint.findByIdAndUpdate(complaint._id, {
                $set : {
                    status : newStatus
                },
                $push : {
                    actionTrail : {
                        datetime : Date.now(),
                        action : `Status changed to ${newStatus}`,
                        remarks : req.body.remarks
                    }
                }
            }).then((result) => {
                if(!result){
                    return res.status(400).send({
                        status : 0,
                        message : `Status not updated`
                    });
                } if (result.status == "Replied") {
                    return res.status(400).send({
                        status: 0,
                        message: 'No further action is possible as it has been marked as Replied.'
                    });
                } else {
                     User.findById(user).then((doc) => {
                         let receiverEmailAddress = doc.email;
                    var transporter = nodemailer.createTransport(emailConfig);

                    var mailOptions = {
                        from: `"${adminName}"${adminEmailAddress}`,
                        to: `${receiverEmailAddress}`,
                        subject: `Sharing ${complaint.objectionOrSuggestion}`,
                        html: `Your complaint has been revieved please check it on website`
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            res.status(500).send({
                                status: 0,
                                message: 'Could Not Email the complaint.',
                                errorDetails: error
                            })
                        }
                        else {
                            res.send({
                                status: 1,
                                message: 'Email Sent successfully',
                                details: info.response
                            })
                        }
                    });
                     }).catch((err) => {
                         res.status(500).send({
                             status : 0,
                             message : 'Error in finding user of this complaint'
                         });
                     });
                    return res.status(200).send({
                        status : 1,
                         message : 'Status updated successfully'
                    });
                }
            }).catch((err) =>{
                return res.status(500).send({
                    status : 0,
                    message : 'Error in update',
                    errorDetails : err
                });
            });
        }
    });
}
module.exports.getStats = (req, res) => {

}