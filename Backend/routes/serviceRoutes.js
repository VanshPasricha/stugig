const express = require('express');
const router = express.Router();
const { createService, getMyServices } = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('freelancer', 'admin'), createService);

router.route('/my')
    .get(protect, authorize('freelancer', 'admin'), getMyServices);

module.exports = router;
