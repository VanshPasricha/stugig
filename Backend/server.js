require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect Database
connectDB();

const app = express();
const http = require('http');
const server = http.createServer(app);
const socketIoSetup = require('./socket');

// Initialize socket setup
socketIoSetup.init(server);

const passport = require('passport');
require('./config/passportConfig');

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/proposals', require('./routes/proposalRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));

// Basic route
app.get('/', (req, res) => {
    res.send('StuGig API is running...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
