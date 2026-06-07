const Message = require('../models/Message');
const User = require('../models/User');
const { getIo, getReceiverSocketId } = require('../socket');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const { receiverId, text } = req.body;

        const message = await Message.create({
            sender: req.user._id,
            receiver: receiverId,
            text
        });

        // Emit real-time message if receiver is online
        const receiverSocketId = getReceiverSocketId(receiverId.toString());
        if (receiverSocketId) {
            getIo().to(receiverSocketId).emit('newMessage', message);
        }

        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get conversation history with a specific user
// @route   GET /api/messages/history/:userId
// @access  Private
const getChatHistory = async (req, res) => {
    try {
        const userId = req.params.userId;
        const currentUserId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: userId },
                { sender: userId, receiver: currentUserId }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all active conversations for the logged in user
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        // Find all messages where user is sender or receiver
        const messages = await Message.find({
            $or: [{ sender: currentUserId }, { receiver: currentUserId }]
        })
        .sort({ createdAt: -1 })
        .populate('sender', 'name profileImage role')
        .populate('receiver', 'name profileImage role');

        // Extract unique conversations
        const conversationsMap = new Map();

        messages.forEach(msg => {
            const isSender = msg.sender._id.toString() === currentUserId.toString();
            const otherUser = isSender ? msg.receiver : msg.sender;
            
            if (!conversationsMap.has(otherUser._id.toString())) {
                conversationsMap.set(otherUser._id.toString(), {
                    otherUser: otherUser,
                    lastMessage: msg.text,
                    lastMessageTime: msg.createdAt,
                    unreadCount: (!isSender && !msg.read) ? 1 : 0
                });
            } else {
                if (!isSender && !msg.read) {
                    conversationsMap.get(otherUser._id.toString()).unreadCount += 1;
                }
            }
        });

        const conversations = Array.from(conversationsMap.values());
        res.json(conversations);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    sendMessage,
    getChatHistory,
    getConversations
};
