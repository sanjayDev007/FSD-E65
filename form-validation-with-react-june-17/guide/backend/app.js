const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const url = require('url');
const querystring = require('querystring');

const USERS_FILE = path.join(__dirname, 'users.json');
const SESSIONS = {};

function enableCORS(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
}

function parseBody(req, cb) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        try {
            cb(JSON.parse(body));
        } catch {
            cb(querystring.parse(body));
        }
    });
}

function readUsers() {
    if (!fs.existsSync(USERS_FILE)) return [];
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function getSessionId(req) {
    const cookie = req.headers.cookie || '';
    const match = cookie.match(/session=([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
}

function createSession(username) {
    const sid = crypto.randomBytes(16).toString('hex');
    SESSIONS[sid] = { username, created: Date.now() };
    return sid;
}

const server = http.createServer((req, res) => {
    enableCORS(res);

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);

    // Signup route
    if (req.method === 'POST' && parsedUrl.pathname === '/signup') {
        parseBody(req, body => {
            const {name, email, username, password, dob} = body;
            console.log(body);
            if (!email || !username || !password || !dob || !name) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'All fields are required: email, username, password, dob, name' }));
                return;
            }
            
            // Extract gender from body or set default
            const { gender } = body;
            let users = readUsers();
            if (users.find(u => u.username === username)) {
                res.writeHead(409, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'User already exists' }));
                return;
            }
            users.push({ email, username, password, dob, gender, name });
            writeUsers(users);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        });
        return;
    }

    // Login route
    if (req.method === 'POST' && parsedUrl.pathname === '/login') {
        parseBody(req, body => {
            const { email, password } = body;
            let users = readUsers();
            const user = users.find(u => u.email === email && u.password === password);
            if (!user) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid credentials' }));
                return;
            }
            const sid = createSession(user.username);
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Set-Cookie': `session=${sid}; HttpOnly; Path=/`
            });
            res.end(JSON.stringify({ success: true }));
        });
        return;
    }

    // Users route
    if (req.method === 'GET' && parsedUrl.pathname === '/users') {
        let users = readUsers();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users.map(u => ({ username: u.username }))));
        return;
    }

    // Home route with session
    if (req.method === 'GET' && parsedUrl.pathname === '/home') {
        const sid = getSessionId(req);
        if (sid && SESSIONS[sid]) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: `Welcome, ${SESSIONS[sid].username}` }));
        } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not logged in' }));
        }
        return;
    }

    // Not found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
