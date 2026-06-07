const Service = require('../models/Service');

// @desc    Create a new service
// @route   POST /api/services
// @access  Private (Freelancer)
const createService = async (req, res) => {
    try {
        const { title, description, price, deliveryTime, category } = req.body;

        const service = await Service.create({
            title,
            description,
            price,
            deliveryTime,
            category,
            freelancer: req.user._id
        });

        res.status(201).json(service);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get logged in freelancer's services
// @route   GET /api/services/my
// @access  Private
const getMyServices = async (req, res) => {
    try {
        const services = await Service.find({ freelancer: req.user._id })
            .sort({ createdAt: -1 });
        res.json(services);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createService,
    getMyServices
};
