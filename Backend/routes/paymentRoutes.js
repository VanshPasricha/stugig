const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getKey } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/key', protect, getKey);

module.exports = router;
