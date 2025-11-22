const { createServer } = require('http');
const { Server } = require('socket.io');
const { app } = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-group', (groupId) => {
        socket.join(groupId);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Make io accessible globally if needed, or pass it to controllers
app.set('io', io);

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
