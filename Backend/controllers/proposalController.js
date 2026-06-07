const Proposal = require('../models/Proposal');
const Job = require('../models/Job');

// @desc    Submit a new proposal (bid)
// @route   POST /api/proposals
// @access  Private
const createProposal = async (req, res) => {
    try {
        const { jobId, coverLetter, bidAmount, estimatedDays } = req.body;

        // Ensure job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Create the proposal
        const proposal = await Proposal.create({
            job: jobId,
            freelancer: req.user._id,
            coverLetter,
            bidAmount,
            estimatedDays
        });

        // Add proposal to the job's proposals array
        job.proposals.push(proposal._id);
        await job.save();

        res.status(201).json(proposal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all proposals for a specific job
// @route   GET /api/proposals/job/:jobId
// @access  Private
const getJobProposals = async (req, res) => {
    try {
        const proposals = await Proposal.find({ job: req.params.jobId })
            .populate('freelancer', 'name profileImage skills')
            .sort({ createdAt: -1 });
            
        res.json(proposals);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get logged in freelancer's proposals
// @route   GET /api/proposals/my
// @access  Private (Freelancer)
const getMyProposals = async (req, res) => {
    try {
        const proposals = await Proposal.find({ freelancer: req.user._id })
            .populate('job', 'title budget status client')
            .sort({ createdAt: -1 });

        // also populate client in job if needed
        const populatedProposals = await Job.populate(proposals, {
            path: 'job.client',
            select: 'name profileImage'
        });

        res.json(populatedProposals);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Accept a proposal (Client only)
// @route   PUT /api/proposals/:id/accept
// @access  Private (Client)
const acceptProposal = async (req, res) => {
    try {
        const proposalId = req.params.id;
        
        // Find proposal
        const proposal = await Proposal.findById(proposalId).populate('job');
        if (!proposal) {
            return res.status(404).json({ message: 'Proposal not found' });
        }

        // Verify that the logged-in user is the client who posted the job
        if (proposal.job.client.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to accept this proposal' });
        }

        // Check if job is already in progress
        if (proposal.job.status !== 'open') {
            return res.status(400).json({ message: 'Job is no longer open' });
        }

        // Update proposal status
        proposal.status = 'accepted';
        await proposal.save();

        // Update other proposals for this job to rejected
        await Proposal.updateMany(
            { job: proposal.job._id, _id: { $ne: proposal._id } },
            { $set: { status: 'rejected' } }
        );

        // Update job status to in_progress
        const job = await Job.findById(proposal.job._id);
        job.status = 'in_progress';
        await job.save();

        res.json({ message: 'Proposal accepted successfully', proposal });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createProposal,
    getJobProposals,
    getMyProposals,
    acceptProposal
};
