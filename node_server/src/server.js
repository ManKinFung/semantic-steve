const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }  // Enable CORS if needed
});

io.on('connection', (socket) => {
    console.log('A Python client connected:', socket.id);

    // Listen for a message from the Python client
    socket.on('message', (data) => {
        console.log('Received message from client:', data);
        // Respond to the client
        socket.emit('response', { message: 'Hello from Node.js server!' });
    });
});

server.listen(3000, () => {
    console.log('Node.js server is listening on port 3000');
});
