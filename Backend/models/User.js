const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function() {
            // Password is required only if the user is not logging in via OAuth
            return !this.googleId && !this.githubId;
        }
    },
    googleId: {
        type: String,
        default: null
    },
    githubId: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['freelancer', 'client', 'admin'],
        default: 'client'
    },
    profileImage: {
        type: String,
        default: ''
    },
    walletBalance: {
        type: Number,
        default: 0
    },
    totalEarnings: {
        type: Number,
        default: 0
    },
    bio: {
        type: String,
        default: ''
    },
    university: {
        type: String,
        default: ''
    },
    skills: [{
        type: String
    }]
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password') || !this.password) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
