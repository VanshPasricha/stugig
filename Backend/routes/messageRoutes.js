const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory, getConversations } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, sendMessage);

router.route('/conversations')
    .get(protect, getConversations);

router.route('/history/:userId')
    .get(protect, getChatHistory);

module.exports = router;
