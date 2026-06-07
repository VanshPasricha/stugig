const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { amount } = req.body; // amount in dollars

        const options = {
            amount: amount * 100, // Razorpay expects amount in smallest currency unit (e.g. cents)
            currency: 'USD',
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        
        if (!order) {
            return res.status(500).json({ message: 'Error creating order' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature === expectedSign) {
            // Payment verified successfully
            
            // Add funds to user wallet
            const user = await User.findById(req.user._id);
            if (user) {
                user.walletBalance += amount;
                await user.save();
            }

            res.status(200).json({ message: 'Payment verified successfully', verified: true });
        } else {
            res.status(400).json({ message: 'Invalid signature sent!', verified: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Razorpay Key
// @route   GET /api/payments/key
// @access  Private
const getKey = (req, res) => {
    res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
};

module.exports = {
    createOrder,
    verifyPayment,
    getKey
};
