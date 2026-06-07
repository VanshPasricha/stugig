const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, getClientDashboard, getFreelancerDashboard } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('client', 'admin'), createJob)
    .get(getJobs);

router.route('/dashboard')
    .get(protect, authorize('client', 'admin'), getClientDashboard);

router.route('/freelancer/dashboard')
    .get(protect, authorize('freelancer', 'admin'), getFreelancerDashboard);

router.route('/:id')
    .get(getJobById);

module.exports = router;
