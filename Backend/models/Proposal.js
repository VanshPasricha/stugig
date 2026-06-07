const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coverLetter: {
        type: String,
        required: true
    },
    bidAmount: {
        type: Number,
        required: true
    },
    estimatedDays: {
        type: Number,
        default: 1
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});

const Proposal = mongoose.model('Proposal', proposalSchema);
module.exports = Proposal;
