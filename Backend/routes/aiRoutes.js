const express = require('express');
const router = express.Router();
const { generateProposal } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate-proposal', protect, generateProposal);

module.exports = router;
