const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const DATA_FILE = path.join(__dirname, 'books.json');
const PORT = 3001;

// Helper to read books.json
function readBooks() {
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}

// Helper to write books.json
function writeBooks(books) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(books, null, 2));
}

// Helper to parse request body
function parseBody(req, cb) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
        try {
            cb(JSON.parse(body));
        } catch {
            cb(null);
        }
    });
}

const server = http.createServer((req, res) => {
    // Set CORS headers for every request
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);

    // GET /posts
    if (method === 'GET' && parsedUrl.pathname === '/posts') {
        const books = readBooks();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(books));
        return;
    }

    // POST /posts
    if (method === 'POST' && parsedUrl.pathname === '/posts') {
        parseBody(req, data => {
            if (!data || !data.title || !data.body || typeof data.userId !== 'number') {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid book data' }));
                return;
            }
            const books = readBooks();
            const newBook = {
                id: books.length ? Math.max(...books.map(b => b.id)) + 1 : 1,
                ...data
            };
            books.push(newBook);
            writeBooks(books);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newBook));
        });
        return;
    }

    // PUT /posts/:id
    if (method === 'PUT' && pathParts[0] === 'posts' && pathParts[1]) {
        const bookId = parseInt(pathParts[1]);
        parseBody(req, data => {
            if (!data || !data.title || !data.body || typeof data.userId !== 'number') {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid book data' }));
                return;
            }
            let books = readBooks();
            const idx = books.findIndex(b => b.id === bookId);
            if (idx === -1) {
                res.writeHead(404);
                res.end(JSON.stringify({ error: 'Book not found' }));
                return;
            }
            books[idx] = { id: bookId, ...data };
            writeBooks(books);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(books[idx]));
        });
        return;
    }

    // DELETE /posts/:id
    if (method === 'DELETE' && pathParts[0] === 'posts' && pathParts[1]) {
        const bookId = parseInt(pathParts[1]);
        let books = readBooks();
        const idx = books.findIndex(b => b.id === bookId);
        if (idx === -1) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Book not found' }));
            return;
        }
        const deleted = books.splice(idx, 1)[0];
        writeBooks(books);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(deleted));
        return;
    }

    // GET /posts/search?query=...
    if (method === 'GET' && pathParts[0] === 'posts' && pathParts[1] === 'search') {
        const query = parsedUrl.query.query ? parsedUrl.query.query.toLowerCase() : '';
        const books = readBooks();
        const results = books.filter(
            b =>
                b.title.toLowerCase().includes(query) ||
                b.body.toLowerCase().includes(query)
        );
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results));
        return;
    }

    // Not found
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
