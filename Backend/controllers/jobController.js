const Job = require('../models/Job');
const Proposal = require('../models/Proposal');
const Transaction = require('../models/Transaction');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
    try {
        const { title, description, category, budgetType, budget } = req.body;

        const job = await Job.create({
            title,
            description,
            category,
            budgetType,
            budget,
            client: req.user._id
        });

        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all open jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'open' })
            .populate('client', 'name profileImage')
            .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('client', 'name profileImage')
            .populate({
                path: 'proposals',
                populate: {
                    path: 'freelancer',
                    select: 'name profileImage'
                }
            });

        if (job) {
            res.json(job);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get client dashboard data (stats, jobs, active hires)
// @route   GET /api/jobs/dashboard
// @access  Private (Client)
const getClientDashboard = async (req, res) => {
    try {
        const clientId = req.user._id;

        // Fetch jobs posted by client
        const postedJobs = await Job.find({ client: clientId })
            .populate('proposals')
            .sort({ createdAt: -1 });

        // Fetch accepted proposals (active hires) for this client's jobs
        const jobIds = postedJobs.map(job => job._id);
        const activeHires = await Proposal.find({ 
            job: { $in: jobIds }, 
            status: 'accepted' 
        })
        .populate('freelancer', 'name profileImage')
        .populate('job', 'title');

        // Fetch total spent (sum of outgoing transactions)
        const transactions = await Transaction.find({ user: clientId, type: 'outgoing' });
        const totalSpent = transactions.reduce((acc, curr) => acc + curr.amount, 0);

        // Proposals received
        const totalProposalsReceived = postedJobs.reduce((acc, job) => acc + job.proposals.length, 0);

        res.json({
            stats: {
                totalSpent: totalSpent,
                activeHires: activeHires.length,
                jobsPosted: postedJobs.length,
                proposalsReceived: totalProposalsReceived
            },
            postedJobs: postedJobs.map(job => ({
                id: job._id,
                title: job.title,
                status: job.status === 'open' ? 'Active' : job.status === 'in_progress' ? 'In Progress' : 'Completed',
                proposals: job.proposals.length,
                budget: `$${job.budget}`,
                posted: new Date(job.createdAt).toLocaleDateString()
            })),
            activeHires: activeHires.map(hire => ({
                id: hire._id,
                freelancerId: hire.freelancer._id,
                name: hire.freelancer.name,
                role: 'Freelancer',
                job: hire.job.title,
                progress: 50, // mock progress
                avatar: hire.freelancer.profileImage || `https://ui-avatars.com/api/?name=${hire.freelancer.name}`
            }))
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get freelancer dashboard data
// @route   GET /api/jobs/freelancer/dashboard
// @access  Private (Freelancer)
const getFreelancerDashboard = async (req, res) => {
    try {
        const freelancerId = req.user._id;

        // Fetch transactions for earnings
        const transactions = await Transaction.find({ user: freelancerId, type: 'incoming', status: 'completed' });
        const totalEarnings = transactions.reduce((acc, curr) => acc + curr.amount, 0);

        // Fetch active bids (proposals by this freelancer)
        const proposals = await Proposal.find({ freelancer: freelancerId });
        const activeBids = proposals.length;

        // Fetch accepted proposals (active projects)
        const activeProjects = proposals.filter(p => p.status === 'accepted').length;

        // Fetch recent open jobs in the marketplace (for AI recommendations / recent list)
        const recentJobs = await Job.find({ status: 'open' })
            .populate('client', 'name profileImage')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            stats: {
                totalEarnings: totalEarnings,
                activeProjects: activeProjects,
                proposalsSent: activeBids,
                profileViews: Math.floor(Math.random() * 500) + 50 // mock profile views
            },
            recentJobs: recentJobs.map(job => ({
                id: job._id,
                title: job.title,
                client: job.client.name,
                due: 'Open', // simple placeholder
                progress: 0,
                price: `$${job.budget}`,
                description: job.description
            }))
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createJob,
    getJobs,
    getJobById,
    getClientDashboard,
    getFreelancerDashboard
};
