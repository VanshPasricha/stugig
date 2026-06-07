const express = require('express');
const router = express.Router();
const { createProposal, getJobProposals, getMyProposals, acceptProposal } = require('../controllers/proposalController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('freelancer', 'admin'), createProposal);

router.route('/my')
    .get(protect, authorize('freelancer', 'admin'), getMyProposals);

router.route('/job/:jobId')
    .get(protect, getJobProposals);

router.route('/:id/accept')
    .put(protect, authorize('client', 'admin'), acceptProposal);

module.exports = router;
