const { Server } = require('socket.io');

let io;
const userSocketMap = new Map(); // userId -> socketId

module.exports = {
    init: (server) => {
        io = new Server(server, {
            cors: {
                origin: "*", // allow all origins or restrict to frontend URL
                methods: ["GET", "POST"]
            }
        });

        io.on('connection', (socket) => {
            console.log('A user connected:', socket.id);

            socket.on('register', (userId) => {
                if (userId) {
                    userSocketMap.set(userId, socket.id);
                    console.log(`User ${userId} registered with socket ${socket.id}`);
                }
            });

            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
                // Remove the disconnected socket from our map
                for (let [userId, socketId] of userSocketMap.entries()) {
                    if (socketId === socket.id) {
                        userSocketMap.delete(userId);
                        break;
                    }
                }
            });
        });

        return io;
    },
    getIo: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    },
    getReceiverSocketId: (userId) => {
        return userSocketMap.get(userId);
    }
};
