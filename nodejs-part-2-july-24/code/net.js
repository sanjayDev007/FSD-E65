const net = require('net');

// Create a simple TCP server
const server = net.createServer((socket) => {
    console.log('Client connected');

    socket.on('data', (data) => {
        console.log('Received:', data.toString());
        socket.write('Echo: ' + data);
    });

    socket.on('end', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});

// Example TCP client
const client = net.createConnection({ port: 3000 }, () => {
    console.log('Connected to server');
    client.write('Hello, server!');
});

client.on('data', (data) => {
    console.log('Server says:', data.toString());
    client.end();
});

client.on('end', () => {
    console.log('Disconnected from server');
});
