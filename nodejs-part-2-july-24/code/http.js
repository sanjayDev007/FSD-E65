const http = require('http');

// Create a simple HTTP server
const server = http.createServer((req, res) => {
    console.log(`Request received: ${req.method} ${req.url}`);

    const data = {
        message: 'Hello, World!',
        time: new Date().toISOString()
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});