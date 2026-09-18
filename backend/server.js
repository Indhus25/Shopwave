const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Store carts by room ID: { 'room123': [items...] }
const roomCarts = {};

io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // User joins a specific shopping room
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);

        // Initialize room cart if it doesn't exist
        if (!roomCarts[roomId]) {
            roomCarts[roomId] = [];
        }

        // Send current room cart to this user
        socket.emit('update-cart', roomCarts[roomId]);
    });

    // Listen for adding an item to a specific room
    socket.on('add-item', ({ roomId, item }) => {
        if (!roomCarts[roomId]) {
            roomCarts[roomId] = [];
        }
        roomCarts[roomId].push(item);
        console.log(`Item added to room [${roomId}]:`, item);

        // Broadcast updated cart ONLY to people in this room
        io.to(roomId).emit('update-cart', roomCarts[roomId]);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(5000, () => {
    console.log('Backend room-server running smoothly on http://localhost:5000');
});