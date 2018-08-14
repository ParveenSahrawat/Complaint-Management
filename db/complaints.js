var mongoose = require('mongoose');

// var counter = require('../models/counter'); //counter model

var complaintSchema = new mongoose.Schema({
    complaintNumber: {
        type: Number
    },
    complaintType: {
        type: String,
        enum: ["Land Use Proposals", "Zoning Acquisition", "Infrastructure Provisions", "Demographic & Population Projections", "Environment Related", "MCA/Control Area/Village Boundary", "Traffic & Transportation", "Others"],
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    relevantParaClause: {
        type: String,
        required: true,
        trim: true
    },
    paraClauseLink: {
        type: String,
        required: false,
        trim: true
    },
    objectionOrSuggestion: {
        type: String,
        enum: ['Objection', 'Suggestion'],
        default: 'Objection'
    },
    complaintDesc: {
        type: String,
        required: true,
        trim: true
    },
    complainant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    postedOn: {
        type: Date,
        default: Date.now()
    },
    official: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    status: {
        type: String,
        enum: ['Registered', 'Under Consideration', 'Replied'],
        default: 'Registered'
    },
    actionTrail: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        action: {
            type: String,
            required: true
        },
        datetime: {
            type: Date,
            default: Date.now()
        },
        remarks: {
            type: String,
            required: false,
            trim: true
        }
    }]
});

// complaintSchema.pre('save', function (next) {
//     var complaint = this;
//     counter.findOneAndUpdate(
//         { 'for': 'complaintNumber' },
//         { $inc: { 'seq': 1 } },
//         (err, counter) => {
//             if (err) {
//                 res.status(500);
//             }
//             else {
//                 if (counter) {
//                     complaint.complaintNumber = counter.seq;
//                     next();
//                 }
//                 else {
//                     // Probably could not find 'counters' collection in DB.                    
//                     var err = new Error('Ref No could not be generated');
//                     next(err);
//                 }
//             }
//         });
// });

module.exports.Complaint = mongoose.model('complaints', complaintSchema);


