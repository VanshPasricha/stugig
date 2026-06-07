const express = require('express');
const router = express.Router();
const { getTransactions, withdrawFunds } = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

router.route('/transactions')
    .get(protect, getTransactions);

router.route('/withdraw')
    .post(protect, withdrawFunds);

module.exports = router;
