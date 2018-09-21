var mongoose = require('mongoose');
var Counter = require('./counter');

var imageSchema = new mongoose.Schema({
    path: {
        type: Array,
        required: true,

    }

});
var complaintSchema = new mongoose.Schema({
    counter : {
        type : Number,
        default : 0
    },
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
    image : [imageSchema],
    complainant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    postedOn: {
        type: Date,
        default: new Date()
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

// complaintSchema.pre('save', (next) => {
//     console.log(`It's pre`);
//     var complaint = this;
//     Counter.findOneAndUpdate(
//         { 'for': 'complaintNumber' },
//         { $inc: { 'seq': 1 } },
//         (err, Counter) => {
//             if (err) {
//                 console.log(`You r in pre`);
//                 res.status(500);
//             }
//             else {
//                 if (Counter) {
//                     console.log(`Counter here`)
//                     complaint.complaintNumber = Counter.seq;
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

module.exports = mongoose.model('complaints', complaintSchema, 'Complaint');


