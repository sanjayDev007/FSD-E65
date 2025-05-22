const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');
const crypto = require('crypto');

// Simple session store
const sessions = {};
const USERS_FILE = path.join(__dirname, 'users.json');

// Initialize users file if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

// MIME types for serving files
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif'
};

// Helper function to read request body
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

// Generate session ID
function generateSessionId() {
  return crypto.randomBytes(16).toString('hex');
}

// Load users from JSON file
function getUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading users file:', err);
    return [];
  }
}

// Save users to JSON file
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Handle CORS and set common headers
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Create server
const server = http.createServer(async (req, res) => {
  // Set CORS headers for all requests
  setCorsHeaders(res);
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  // Parse URL
  const parsedUrl = url.parse(req.url);
  const pathname = parsedUrl.pathname;

  // API endpoints
  if (pathname === '/api/register' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const { username, password } = JSON.parse(body);
      
      if (!username || !password) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Username and password are required' }));
      }
      
      const users = getUsers();
      
      // Check if user already exists
      if (users.some(user => user.username === username)) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Username already exists' }));
      }
      
      // Hash password
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
      
      // Create new user
      users.push({ username, hash, salt });
      saveUsers(users);
      
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, message: 'User registered successfully' }));
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Server error' }));
    }
  }
  else if (pathname === '/api/login' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const { username, password } = JSON.parse(body);
      
      if (!username || !password) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Username and password are required' }));
      }
      
      const users = getUsers();
      const user = users.find(user => user.username === username);
      
      if (!user) {
        res.statusCode = 401;
        return res.end(JSON.stringify({ error: 'Invalid username or password' }));
      }
      
      // Verify password
      const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
      if (hash !== user.hash) {
        res.statusCode = 401;
        return res.end(JSON.stringify({ error: 'Invalid username or password' }));
      }
      
      // Create session
      const sessionId = generateSessionId();
      sessions[sessionId] = {
        username,
        createdAt: Date.now()
      };
      
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ 
        success: true, 
        message: 'Login successful',
        sessionId,
        username
      }));
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Server error' }));
    }
  }
  else if (pathname === '/api/logout' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const { sessionId } = JSON.parse(body);
      
      if (sessionId && sessions[sessionId]) {
        delete sessions[sessionId];
      }
      
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, message: 'Logout successful' }));
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Server error' }));
    }
  }
  else if (pathname === '/api/session' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const { sessionId } = JSON.parse(body);
      
      if (!sessionId || !sessions[sessionId]) {
        res.statusCode = 401;
        return res.end(JSON.stringify({ error: 'Invalid session' }));
      }
      
      // Session valid
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ 
        success: true, 
        username: sessions[sessionId].username 
      }));
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Server error' }));
    }
  }
  // Serve static files
  else {
    let filePath;
    
    if (pathname === '/' || pathname === '/index.html') {
      filePath = path.join(__dirname, 'index.html');
    } else if (pathname === '/login' || pathname === '/login.html') {
      filePath = path.join(__dirname, 'login.html');
    } else if (pathname === '/register' || pathname === '/register.html') {
      filePath = path.join(__dirname, 'register.html');
    } else {
      // Check if file exists in guide directory
      filePath = path.join(__dirname, pathname.substring(1));
      if (!fs.existsSync(filePath)) {
        // Check if file exists in parent directory
        filePath = path.join(__dirname, '..', pathname.substring(1));
      }
    }
    
    fs.stat(filePath, (err, stat) => {
      if (err || !stat.isFile()) {
        res.statusCode = 404;
        return res.end('Not Found');
      }
      
      const ext = path.extname(filePath);
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.setHeader('Content-Type', contentType);
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
