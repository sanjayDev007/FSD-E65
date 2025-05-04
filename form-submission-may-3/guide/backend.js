const http = require('http');
const url = require('url');


// Array to store all requests
const requestHistory = [];

// Function to parse request body
const parseBody = (req) => {
    return new Promise((resolve, reject) => {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        req.on('end', () => {
            try {
                const bodyString = Buffer.concat(body).toString();
                const parsedBody = bodyString ? JSON.parse(bodyString) : {};
                resolve(parsedBody);
            } catch (error) {
                resolve({}); // Return empty object on parse failure
            }
        });
    });
};

// Create server
const server = http.createServer(async (req, res) => {
    // Parse URL and query
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const query = parsedUrl.query;
    
    // Set response header
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    try {
        // Parse body for non-GET requests
        const body = ['POST', 'PUT', 'PATCH'].includes(req.method) ? 
            await parseBody(req) : {};
        
        // Log requests (except for /requests route)
        if (path !== '/requests') {
            const requestData = {
                method: req.method,
                url: req.url,
                body: body,
                query: query,
                timestamp: new Date().toISOString()
            };
            requestHistory.push(requestData);
            console.log(`${req.method} request to ${req.url}`);
        }
        
        // Route handling
        if (path === '/' && req.method === 'GET') {
            res.end(JSON.stringify({ message: 'GET request received' }));
        } else if (path === '/' && req.method === 'POST') {
            res.end(JSON.stringify({ 
                message: 'POST request received',
                data: body 
            }));
        } else if (path === '/requests' && req.method === 'GET') {
            res.end(JSON.stringify(requestHistory));
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Not Found' }));
        }
    } catch (err) {
        console.error(err.stack);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Something went wrong!' }));
    }
});

const port = 3210;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});