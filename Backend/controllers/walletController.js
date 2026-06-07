const Transaction = require('../models/Transaction');
const User = require('../models/User');

// @desc    Get user's wallet transactions
// @route   GET /api/wallet/transactions
// @access  Private
const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        // Calculate available balance (incoming - outgoing completed)
        let balance = 0;
        let inEscrow = 0;

        transactions.forEach(txn => {
            if (txn.status === 'completed') {
                balance += (txn.type === 'incoming' ? txn.amount : -txn.amount);
            } else if (txn.status === 'pending') {
                inEscrow += txn.amount;
            }
        });

        res.json({ transactions, balance, inEscrow });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Withdraw funds
// @route   POST /api/wallet/withdraw
// @access  Private
const withdrawFunds = async (req, res) => {
    try {
        const { amount } = req.body;

        // Verify balance
        const transactions = await Transaction.find({ user: req.user._id, status: 'completed' });
        let balance = transactions.reduce((acc, txn) => acc + (txn.type === 'incoming' ? txn.amount : -txn.amount), 0);

        if (amount > balance) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        // Create withdrawal transaction
        const withdrawal = await Transaction.create({
            user: req.user._id,
            type: 'outgoing',
            amount: amount,
            status: 'completed',
            description: 'Withdrawal to Bank Account'
        });

        res.status(201).json(withdrawal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getTransactions,
    withdrawFunds
};
